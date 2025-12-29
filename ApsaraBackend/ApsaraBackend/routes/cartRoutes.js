import express from "express";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", getCart);
router.put("/update", updateCartQuantity);
router.delete("/:userId/:productId", removeFromCart);

export default router;
