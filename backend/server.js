import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import demoRouter from "./routes/demoRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import path from "path";
import { access, copyFile, mkdir, readdir } from "fs/promises";
import { fileURLToPath } from "url";

// app config
const app = express();
const port =process.env.PORT || 4000;
const demoMode = !process.env.MONGO_URL;
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const bundledUploads = path.join(backendDirectory, "uploads");
const uploadsDirectory = process.env.UPLOADS_DIR || bundledUploads;
const frontendBuild = path.join(backendDirectory, "..", "frontend", "dist");
const adminBuild = path.join(backendDirectory, "..", "admin", "dist");
process.env.JWT_SECRET ||= demoMode ? "amber-local-demo-secret-change-before-deploy" : "";
if (demoMode && process.env.NODE_ENV === "production") throw new Error("MONGO_URL is required in production; local demo mode is only for development.");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required when MONGO_URL is configured.");

//middlewares
app.use(express.json());
app.use(cors());
await mkdir(uploadsDirectory, { recursive: true });
if (uploadsDirectory !== bundledUploads) {
  for (const filename of await readdir(bundledUploads)) {
    const target = path.join(uploadsDirectory, filename);
    try { await access(target); }
    catch { await copyFile(path.join(bundledUploads, filename), target); }
  }
}
app.use("/images", express.static(uploadsDirectory));
app.get("/api/status", (_req, res) => res.json({ success: true, app: "Amber", mode: demoMode ? "local-demo" : "mongodb" }));

if (demoMode) {
  console.log("MongoDB is not configured. Starting Amber in local demo mode with file-based data.");
  app.use(demoRouter);
} else {
  connectDB().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
  app.use("/api/food", foodRouter);
  app.use("/api/restaurant", restaurantRouter);
  app.use("/api/user", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);
}

if (process.env.NODE_ENV === "production") {
  app.use("/admin", express.static(adminBuild));
  app.get("/admin/*", (_req, res) => res.sendFile(path.join(adminBuild, "index.html")));
  app.use(express.static(frontendBuild));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/images/")) return next();
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
} else {
  app.get("/", (_req, res) => res.json({ success: true, app: "Amber", mode: demoMode ? "local-demo" : "mongodb" }));
}

app.listen(port, demoMode ? "127.0.0.1" : "0.0.0.0", () => {
  console.log(`Amber API running at http://${demoMode ? "127.0.0.1" : "0.0.0.0"}:${port}`);
});
