import "dotenv/config";
import mongoose from "mongoose";
import restaurantModel from "../models/restaurantModel.js";
import foodModel from "../models/foodModel.js";
import { seedFoods, seedRestaurants } from "../config/demoStore.js";

if (!process.env.MONGO_URL) throw new Error("Set MONGO_URL in backend/.env before seeding MongoDB.");

try {
  await mongoose.connect(process.env.MONGO_URL);
  const restaurantIds = new Map();
  for (const restaurant of seedRestaurants) {
    const { _id, ...fields } = restaurant;
    const saved = await restaurantModel.findOneAndUpdate(
      { name: fields.name },
      { $setOnInsert: fields },
      { upsert: true, new: true },
    );
    restaurantIds.set(_id, saved._id);
  }

  let added = 0;
  for (const food of seedFoods) {
    const { _id, restaurantId, ...fields } = food;
    const result = await foodModel.updateOne(
      { name: fields.name, restaurantId: restaurantIds.get(restaurantId) },
      { $setOnInsert: { ...fields, restaurantId: restaurantIds.get(restaurantId) } },
      { upsert: true },
    );
    if (result.upsertedCount) added += 1;
  }
  console.log(`Seeded ${seedRestaurants.length} restaurants; added ${added} menu items.`);
} finally {
  await mongoose.disconnect();
}
