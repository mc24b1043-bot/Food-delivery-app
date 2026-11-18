import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import restaurantModel from "../models/restaurantModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const uploadsDirectory = process.env.UPLOADS_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");

// add food items

const addFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId || req.body.userId);
    if (userData?.role === "admin") {
      if (!req.file) return res.status(400).json({ success: false, message: "Choose a dish image." });
      const restaurant = await restaurantModel.findById(req.body.restaurantId);
      if (!restaurant) return res.status(400).json({ success: false, message: "Choose a valid restaurant first." });
      const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        restaurantId: restaurant._id,
        isVeg: req.body.isVeg === "true" || req.body.isVeg === true,
        image: req.file.filename,
      });
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId || req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(path.join(uploadsDirectory, food.image), () => {});
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
