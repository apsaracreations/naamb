import express from "express";
import multer from "multer";
import fs from "fs";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

fs.mkdirSync("uploads/products", { recursive: true });

// 🧩 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Use upload middleware here to parse multipart/form-data
router.post("/add", requireAdmin, upload.array("images", 5), addProduct);

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.put("/update/:id", requireAdmin, upload.array("images", 5), updateProduct);
router.delete("/delete/:id", requireAdmin, deleteProduct);

export default router;
