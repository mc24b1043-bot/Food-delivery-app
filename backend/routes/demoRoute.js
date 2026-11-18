import { randomUUID } from "crypto";
import express from "express";
import multer from "multer";
import path from "path";
import { mkdir, unlink } from "fs/promises";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import validator from "validator";
import authMiddleware from "../middleware/auth.js";
import { readStore, updateStore } from "../config/demoStore.js";

const router = express.Router();
const uploadsPath = process.env.UPLOADS_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
await mkdir(uploadsPath, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsPath,
    filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
});
const tokenFor = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET);
const isAdmin = (store, userId) => store.users.some((user) => user._id === userId && user.role === "admin");
const userIdFrom = (req) => req.userId || req.body?.userId;
const requireAdmin = async (req, res, next) => {
  try {
    if (!isAdmin(await readStore(), userIdFrom(req))) {
      return res.status(403).json({ success: false, message: "Admin access is required." });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not verify admin access." });
  }
};

router.get("/api/status", (_req, res) => res.json({ success: true, mode: "local-demo" }));

router.post("/api/user/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !validator.isEmail(email) || password.length < 8) {
      return res.json({ success: false, message: "Enter a name, valid email, and password of at least 8 characters." });
    }
    const result = await updateStore(async (store) => {
      if (store.users.some((user) => user.email === email)) return { error: "An account with this email already exists." };
      const configuredAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const role = configuredAdmin ? (configuredAdmin === email ? "admin" : "user") : (store.users.length === 0 ? "admin" : "user");
      const user = { _id: randomUUID(), name, email, password: await bcrypt.hash(password, 10), role, cartData: {} };
      store.users.push(user);
      return { user };
    });
    if (result.error) return res.json({ success: false, message: result.error });
    res.json({ success: true, token: tokenFor(result.user), role: result.user.role });
  } catch (error) {
    console.error("Demo registration failed:", error);
    res.status(500).json({ success: false, message: "Could not create your account." });
  }
});

router.post("/api/user/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const store = await readStore();
    const user = store.users.find((entry) => entry.email === email);
    if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.password))) {
      return res.json({ success: false, message: "Email or password is incorrect." });
    }
    res.json({ success: true, token: tokenFor(user), role: user.role });
  } catch (error) {
    console.error("Demo login failed:", error);
    res.status(500).json({ success: false, message: "Could not log in." });
  }
});

router.get("/api/food/list", async (_req, res) => {
  try { res.json({ success: true, data: (await readStore()).foods }); }
  catch (error) { console.error(error); res.status(500).json({ success: false, message: "Could not load menu." }); }
});

router.get("/api/restaurant/list", async (_req, res) => {
  try {
    const store = await readStore();
    const data = store.restaurants.map((restaurant) => ({
      ...restaurant,
      itemCount: store.foods.filter((food) => food.restaurantId === restaurant._id).length,
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load restaurants." });
  }
});

router.post("/api/restaurant/add", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const cuisine = String(req.body.cuisine || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name || !cuisine || !description) {
      return res.status(400).json({ success: false, message: "Restaurant name, cuisine, and description are required." });
    }
    const restaurant = await updateStore((store) => {
      if (store.restaurants.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) return { error: "A restaurant with this name already exists." };
      const created = {
        _id: `restaurant-${randomUUID()}`,
        name,
        cuisine,
        description,
        deliveryTime: String(req.body.deliveryTime || "25-35 min").trim(),
        rating: 4.5,
        image: ["1722865444288food_1.png", "1722866830901food_22.png", "1722867018540food_26.png", "1722866694357food_19.png", "1722865976487food_7.png"][store.restaurants.length % 5],
      };
      store.restaurants.push(created);
      return { restaurant: created };
    });
    if (restaurant.error) return res.status(409).json({ success: false, message: restaurant.error });
    res.status(201).json({ success: true, message: "Restaurant added. Now add its menu items.", data: restaurant.restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not add this restaurant." });
  }
});

router.post("/api/food/add", authMiddleware, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const result = await updateStore((store) => {
      if (!isAdmin(store, userIdFrom(req))) return { error: "Admin access is required to add menu items." };
      if (!req.file) return { error: "Choose an image for this dish." };
      const food = {
        _id: randomUUID(),
        restaurantId: String(req.body.restaurantId || ""),
        name: String(req.body.name || "").trim(),
        description: String(req.body.description || "").trim(),
        price: Number(req.body.price),
        category: String(req.body.category || "").trim(),
        isVeg: String(req.body.isVeg).toLowerCase() === "true",
        image: req.file.filename,
      };
      if (!food.name || !food.description || !food.category || !Number.isFinite(food.price) || food.price <= 0 || !store.restaurants.some((restaurant) => restaurant._id === food.restaurantId)) {
        return { error: "Choose a restaurant and enter a name, description, category, and positive price." };
      }
      store.foods.unshift(food);
      return { food };
    });
    if (result.error) return res.status(400).json({ success: false, message: result.error });
    res.json({ success: true, message: "Dish added to the menu." });
  } catch (error) { console.error(error); res.status(500).json({ success: false, message: "Could not add this dish." }); }
});

router.post("/api/food/remove", authMiddleware, async (req, res) => {
  try {
    const result = await updateStore((store) => {
      if (!isAdmin(store, userIdFrom(req))) return { error: "Admin access is required to remove menu items." };
      const index = store.foods.findIndex((food) => food._id === req.body.id);
      if (index < 0) return { error: "Dish not found." };
      return { food: store.foods.splice(index, 1)[0] };
    });
    if (result.error) return res.status(404).json({ success: false, message: result.error });
    if (result.food?.image) await unlink(path.join(uploadsPath, result.food.image)).catch(() => {});
    res.json({ success: true, message: "Dish removed from the menu." });
  } catch (error) { console.error(error); res.status(500).json({ success: false, message: "Could not remove this dish." }); }
});

router.post("/api/cart/get", authMiddleware, async (req, res) => {
  const store = await readStore();
  const user = store.users.find((entry) => entry._id === userIdFrom(req));
  if (!user) return res.status(404).json({ success: false, message: "Account not found." });
  res.json({ success: true, cartData: user.cartData || {} });
});

router.post("/api/cart/add", authMiddleware, async (req, res) => {
  const result = await updateStore((store) => {
    const user = store.users.find((entry) => entry._id === userIdFrom(req));
    if (!user || !store.foods.some((food) => food._id === req.body.itemId)) return false;
    user.cartData ||= {};
    user.cartData[req.body.itemId] = (user.cartData[req.body.itemId] || 0) + 1;
    return true;
  });
  res.json({ success: result, message: result ? "Added to cart." : "Account or dish not found." });
});

router.post("/api/cart/remove", authMiddleware, async (req, res) => {
  const result = await updateStore((store) => {
    const user = store.users.find((entry) => entry._id === userIdFrom(req));
    if (!user) return false;
    user.cartData ||= {};
    const quantity = user.cartData[req.body.itemId] || 0;
    if (quantity <= 1) delete user.cartData[req.body.itemId];
    else user.cartData[req.body.itemId] = quantity - 1;
    return true;
  });
  res.json({ success: result, message: result ? "Removed from cart." : "Account not found." });
});

router.post("/api/order/place", authMiddleware, async (req, res) => {
  try {
    const order = await updateStore((store) => {
      const user = store.users.find((entry) => entry._id === userIdFrom(req));
      if (!user) return { error: "Account not found." };
      const items = Object.entries(user.cartData || {}).map(([id, quantity]) => {
        const food = store.foods.find((entry) => entry._id === id);
        return food && quantity > 0 ? { ...food, quantity } : null;
      }).filter(Boolean);
      if (!items.length) return { error: "Your cart is empty." };
      const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 2);
      const created = { _id: randomUUID(), userId: user._id, items, amount, address: req.body.address || {}, payment: false, status: "Food Processing", date: Date.now() };
      store.orders.unshift(created);
      user.cartData = {};
      return { order: created };
    });
    if (order.error) return res.status(400).json({ success: false, message: order.error });
    const frontendUrl = process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || "http://127.0.0.1:5173";
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const lineItems = order.order.items.map((item) => ({
        price_data: { currency: "usd", product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) },
        quantity: item.quantity,
      }));
      lineItems.push({ price_data: { currency: "usd", product_data: { name: "Delivery Charges" }, unit_amount: 200 }, quantity: 1 });
      const session = await stripe.checkout.sessions.create({ line_items: lineItems, mode: "payment", success_url: `${frontendUrl}/verify?success=true&orderId=${order.order._id}`, cancel_url: `${frontendUrl}/verify?success=false&orderId=${order.order._id}` });
      return res.json({ success: true, session_url: session.url });
    }
    res.json({ success: true, demo: true, session_url: `${frontendUrl}/verify?success=true&orderId=${order.order._id}&demo=true` });
  } catch (error) { console.error(error); res.status(500).json({ success: false, message: "Could not create the order." }); }
});

router.post("/api/order/verify", async (req, res) => {
  const result = await updateStore((store) => {
    const index = store.orders.findIndex((order) => order._id === req.body.orderId);
    if (index < 0) return false;
    if (req.body.success === "true") store.orders[index].payment = true;
    else store.orders.splice(index, 1);
    return true;
  });
  res.json({ success: result && req.body.success === "true", message: result ? "Order updated." : "Order not found." });
});

router.post("/api/order/userorders", authMiddleware, async (req, res) => {
  const store = await readStore();
  res.json({ success: true, data: store.orders.filter((order) => order.userId === userIdFrom(req)) });
});

router.get("/api/order/list", authMiddleware, async (req, res) => {
  const store = await readStore();
  if (!isAdmin(store, userIdFrom(req))) return res.status(403).json({ success: false, message: "Admin access is required." });
  res.json({ success: true, data: store.orders });
});

router.post("/api/order/status", authMiddleware, async (req, res) => {
  const result = await updateStore((store) => {
    if (!isAdmin(store, userIdFrom(req))) return false;
    const order = store.orders.find((entry) => entry._id === req.body.orderId);
    if (!order) return false;
    order.status = req.body.status;
    return true;
  });
  res.json({ success: result, message: result ? "Order status updated." : "Order or admin account not found." });
});

export default router;
