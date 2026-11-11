import express from "express";
import multer from "multer";
import fs from "fs";
import { addBlog, getAllBlogs, deleteBlog } from "../controllers/blogController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

fs.mkdirSync("uploads/blogs", { recursive: true });

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
router.post("/add", requireAdmin, upload.single("image"), addBlog);

// 📥 Get all blogs
router.get("/get", getAllBlogs);

// ❌ Delete blog
router.delete("/delete/:id", requireAdmin, deleteBlog);

export default router;
