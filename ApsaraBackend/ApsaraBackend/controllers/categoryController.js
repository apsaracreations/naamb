import Category from "../models/Categories.js";
import Product from "../models/Product.js";

// ➕ Add new category
export const createCategory = async (req, res) => {
  try {
    const { name, bannerHeading, filters } = req.body;

    // Uploaded file paths
    const bannerImage = req.files?.["bannerImage"]?.[0]?.path || "";
    const headingImage = req.files?.["headingImage"]?.[0]?.path || "";

    if (!name || !bannerHeading || !bannerImage || !headingImage) {
      return res.status(400).json({
        message: "Name, banner heading, banner image and heading image are all required",
      });
    }

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
    console.error("Error creating category", err); res.status(500).json({ message: "Error creating category" });
  }
};

// 📦 Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Server Error", error); res.status(500).json({ message: "Server Error" });
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
    console.error("Server Error", error); res.status(500).json({ message: "Server Error" });
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
    console.error("Server Error", error); res.status(500).json({ message: "Server Error" });
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
    console.error("Server Error", error); res.status(500).json({ message: "Server Error" });
  }
};

