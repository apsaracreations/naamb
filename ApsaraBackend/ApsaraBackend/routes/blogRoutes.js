import express from "express";
import { imageUpload } from "../middleware/imageUpload.js";
import { addBlog, getAllBlogs, deleteBlog } from "../controllers/blogController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = imageUpload("blogs");

// 📤 Add blog
router.post("/add", requireAdmin, upload.single("image"), addBlog);

// 📥 Get all blogs
router.get("/get", getAllBlogs);

// ❌ Delete blog
router.delete("/delete/:id", requireAdmin, deleteBlog);

export default router;
