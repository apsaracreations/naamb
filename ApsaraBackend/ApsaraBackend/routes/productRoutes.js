import express from "express";
import { imageUpload } from "../middleware/imageUpload.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = imageUpload("products");

// ✅ Use upload middleware here to parse multipart/form-data
router.post("/add", requireAdmin, upload.array("images", 5), addProduct);

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.put("/update/:id", requireAdmin, upload.array("images", 5), updateProduct);
router.delete("/delete/:id", requireAdmin, deleteProduct);

export default router;
