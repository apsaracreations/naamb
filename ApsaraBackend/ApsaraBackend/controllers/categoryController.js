import Category from "../models/Categories.js";
import Product from "../models/Product.js";

// ➕ Add new category
export const createCategory = async (req, res) => {
  try {
    const { name, bannerHeading, filters } = req.body;

    // Uploaded file paths
    const bannerImage = req.files["bannerImage"]?.[0]?.path || "";
    const headingImage = req.files["headingImage"]?.[0]?.path || "";

    const category = new Category({
      name,
      bannerHeading,
      bannerImage,
      headingImage,
      filters: filters ? filters.split(",") : [],
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

// 📦 Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✏️ Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
const { name, bannerHeading, filters } = req.body;

const bannerImage = req.files?.bannerImage?.[0]?.path || undefined;
const headingImage = req.files?.headingImage?.[0]?.path || undefined;

const updateData = { name, bannerHeading };

if (filters) updateData.filters = Array.isArray(filters) ? filters : filters.split(",");
if (bannerImage) updateData.bannerImage = bannerImage;
if (headingImage) updateData.headingImage = headingImage;


const category = await Category.findByIdAndUpdate(id, updateData, { new: true });


    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// 🔍 Get single category + products
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch products under this category
    const products = await Product.find({ categoryId: id }).sort({ createdAt: -1 });

    res.json({
      category,
      products,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// ❌ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all products under this category
    await Product.deleteMany({ categoryId: id });

    res.json({ message: "Category and its products deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

