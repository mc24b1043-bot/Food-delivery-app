import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userModel.js";

const listRestaurants = async (_req, res) => {
  try {
    const restaurants = await restaurantModel.find({}).sort({ name: 1 }).lean();
    const counts = await foodModel.aggregate([
      { $match: { restaurantId: { $exists: true, $ne: null } } },
      { $group: { _id: "$restaurantId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((entry) => [String(entry._id), entry.count]));
    res.json({ success: true, data: restaurants.map((restaurant) => ({ ...restaurant, itemCount: countMap.get(String(restaurant._id)) || 0 })) });
  } catch (error) {
    console.error("Could not list restaurants:", error);
    res.status(500).json({ success: false, message: "Could not load restaurants." });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const admin = await userModel.findById(req.body.userId);
    if (admin?.role !== "admin") return res.status(403).json({ success: false, message: "Admin access is required." });
    const name = String(req.body.name || "").trim();
    const cuisine = String(req.body.cuisine || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name || !cuisine || !description) return res.status(400).json({ success: false, message: "Restaurant name, cuisine, and description are required." });
    const coverImages = ["1722865444288food_1.png", "1722866830901food_22.png", "1722867018540food_26.png", "1722866694357food_19.png", "1722865976487food_7.png"];
    const restaurantCount = await restaurantModel.countDocuments();
    const restaurant = await restaurantModel.create({
      name, cuisine, description,
      deliveryTime: String(req.body.deliveryTime || "25-35 min").trim(),
      image: coverImages[restaurantCount % coverImages.length],
    });
    res.status(201).json({ success: true, message: "Restaurant added. Add its dishes from Add Items.", data: restaurant });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A restaurant with this name already exists." });
    console.error("Could not add restaurant:", error);
    res.status(500).json({ success: false, message: "Could not add this restaurant." });
  }
};

export { listRestaurants, addRestaurant };
