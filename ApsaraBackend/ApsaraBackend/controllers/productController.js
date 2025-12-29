import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import Category from "../models/Categories.js";

// Multer config (for multiple product images)
const storage = multer.diskStorage({
  destination: "uploads/products",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { files: 5 },
}).array("images", 5); // Accept up to 5 images

// 🟢 Add new product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      points,
      materialsCare,
      dimensions,
      categoryId,
    } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const imagePaths = req.files.map((file) => `/uploads/products/${file.filename}`);

    // Fix points handling
    const formattedPoints = Array.isArray(points)
      ? points
      : typeof points === "string"
      ? points.split(",")
      : [];

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      points: formattedPoints,
      materialsCare,
      dimensions,
      categoryId,
      categoryName: category.name,
      images: imagePaths,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// 🟡 Get all products
export const getAllProducts = async (req, res) => {
  try {
const products = await Product.find().populate("categoryId");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟠 Update product
export const updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((file) => file.path);
      }

      if (updateData.points) updateData.points = JSON.parse(updateData.points);

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

      res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// 🔴 Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
