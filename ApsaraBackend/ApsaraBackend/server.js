import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; 
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Serve images
app.use("/uploads", express.static("uploads"));

// ✅ Enable CORS for all origins
app.use(cors()); // Just this line is enough to allow all origins

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// 🧩 Define host and port manually
const PORT = process.env.PORT || 5000;
const HOST = "192.168.1.6";

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://192.168.1.6:${PORT}`);
});

