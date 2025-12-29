import express from "express";
import {
  addReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/all", getAllReviews);
router.delete("/delete/:id", deleteReview);

export default router;
