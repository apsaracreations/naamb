import express from "express";
import multer from "multer";
import path from "path";
import { addBlog, getAllBlogs, deleteBlog } from "../controllers/blogController.js";

const router = express.Router();

// 🧩 Set up Multer storage for blog images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📤 Add blog
router.post("/add", upload.single("image"), addBlog);

// 📥 Get all blogs
router.get("/get", getAllBlogs);

// ❌ Delete blog
router.delete("/delete/:id", deleteBlog);

export default router;
