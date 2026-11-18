import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  cuisine: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  deliveryTime: { type: String, default: "25-35 min" },
  rating: { type: Number, default: 4.5 },
  image: { type: String, default: "1722865444288food_1.png" },
}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;
