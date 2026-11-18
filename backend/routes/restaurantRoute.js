import express from "express";
import { addRestaurant, listRestaurants } from "../controllers/restaurantController.js";
import authMiddleware from "../middleware/auth.js";

const restaurantRouter = express.Router();
restaurantRouter.get("/list", listRestaurants);
restaurantRouter.post("/add", authMiddleware, addRestaurant);

export default restaurantRouter;
