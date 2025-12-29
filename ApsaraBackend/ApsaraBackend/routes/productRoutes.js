import express from "express";
import multer from "multer";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

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
router.post("/add", upload.array("images", 5), addProduct);

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.put("/update/:id", upload.array("images", 5), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
