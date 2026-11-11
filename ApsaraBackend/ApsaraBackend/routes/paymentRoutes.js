import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrdersByUser,
  updateOrderShipping
} from "../controllers/paymentController.js";
import { requireAdmin, requireUser, sameUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", requireUser, createOrder);
router.post("/verify-payment", verifyPayment); // protected by the Razorpay signature
router.get("/orders", requireAdmin, getAllOrders);
router.get("/orders/user/:userId", requireUser, sameUser("params"), getOrdersByUser);

// ➕ New Route: Update shipping info of an order
router.put("/orders/:orderId/shipping", requireAdmin, updateOrderShipping);

export default router;
