import express from "express";
import { 
  createOrder, 
  verifyPayment,
  getAllOrders,
  getOrdersByUser,
  updateOrderShipping
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/orders", getAllOrders);
router.get("/orders/user/:userId", getOrdersByUser);

// ➕ New Route: Update shipping info of an order
router.put("/orders/:orderId/shipping", updateOrderShipping);

export default router;
