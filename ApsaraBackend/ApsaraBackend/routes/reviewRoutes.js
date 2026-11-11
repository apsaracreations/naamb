import express from "express";
import {
  addReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/all", getAllReviews);
router.delete("/delete/:id", requireAdmin, deleteReview);

export default router;
