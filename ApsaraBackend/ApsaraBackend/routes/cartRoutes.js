import express from "express";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cartController.js";
import { requireUser, sameUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireUser, sameUser("body"), addToCart);
router.get("/get/:userId", requireUser, sameUser("params"), getCart);
router.put("/update", requireUser, sameUser("body"), updateCartQuantity);
router.delete("/:userId/:productId", requireUser, sameUser("params"), removeFromCart);

export default router;
