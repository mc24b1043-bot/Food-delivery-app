import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import demoRouter from "./routes/demoRoute.js";
import path from "path";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";

// app config
const app = express();
const port =process.env.PORT || 4000;
const demoMode = !process.env.MONGO_URL;
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(backendDirectory, "uploads");
process.env.JWT_SECRET ||= demoMode ? "amber-local-demo-secret-change-before-deploy" : "";
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required when MONGO_URL is configured.");

//middlewares
app.use(express.json());
app.use(cors());
await mkdir(uploadsDirectory, { recursive: true });
app.use("/images", express.static(uploadsDirectory));

if (demoMode) {
  console.log("MongoDB is not configured. Starting Amber in local demo mode with file-based data.");
  app.use(demoRouter);
} else {
  connectDB().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
  app.use("/api/food", foodRouter);
  app.use("/api/user", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);
}

app.get("/", (req, res) => {
  res.json({ success: true, app: "Amber", mode: demoMode ? "local-demo" : "mongodb" });
});

app.listen(port, demoMode ? "127.0.0.1" : "0.0.0.0", () => {
  console.log(`Amber API running at http://${demoMode ? "127.0.0.1" : "0.0.0.0"}:${port}`);
});
