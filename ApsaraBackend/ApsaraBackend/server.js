import "./config/uploadsVolume.js"; // must stay first: routes create uploads/* on import
import path from "path";
import fs from "fs";
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

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Serve the built storefront + admin (Apsaraweb/dist) from the same service.
// Any non-API path falls back to index.html so React Router handles /admin, /product/:id, etc.
const webDist = path.resolve("../../Apsaraweb/dist");
if (fs.existsSync(path.join(webDist, "index.html"))) {
  app.use(express.static(webDist));
  app.get(/^(?!\/uploads\/).*/, (req, res) => res.sendFile(path.join(webDist, "index.html")));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

