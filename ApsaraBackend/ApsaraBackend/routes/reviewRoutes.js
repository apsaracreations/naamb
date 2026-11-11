import express from "express";
import { addReview, getAllReviews, getAllReviewsAdmin, deleteReview } from "../controllers/reviewController.js";
import { requireAdmin, requireUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireUser, addReview);
router.get("/all", getAllReviews);
router.get("/admin/all", requireAdmin, getAllReviewsAdmin);
router.delete("/delete/:id", requireAdmin, deleteReview);

export default router;
