import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const foodRouter = express.Router();

// Image Storage Engine

const uploadsDirectory = process.env.UPLOADS_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
await mkdir(uploadsDirectory, { recursive: true });
const storage= multer.diskStorage({
    destination: uploadsDirectory,
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})

foodRouter.post("/add",authMiddleware,upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);

export default foodRouter;
