import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  requireAdmin,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "headingImage", maxCount: 1 },
  ]),
  createCategory
);

router.get("/get", getCategories);
router.get("/get/:id", getCategoryById); // 👈 single category API
router.put(
  "/update/:id",
  requireAdmin,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "headingImage", maxCount: 1 },
  ]),
  updateCategory
);

router.delete("/delete/:id", requireAdmin, deleteCategory);

export default router;
