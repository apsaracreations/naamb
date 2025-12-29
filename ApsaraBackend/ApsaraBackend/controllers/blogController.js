import Blog from "../models/Blog.js";

// 📤 Add a new blog
export const addBlog = async (req, res) => {
  try {
    const { heading, description, link } = req.body;
    const image = req.file ? req.file.path : null;

    if (!heading || !description || !link || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = new Blog({ image, heading, description, link });
    await newBlog.save();

    res.status(201).json({ message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error adding blog", error });
  }
};

// 📥 Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// ❌ Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
