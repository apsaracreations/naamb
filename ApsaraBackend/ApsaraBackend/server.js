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
import { razorpayWebhook } from "./controllers/razorpayWebhook.js";
import { securityHeaders, authLimiter, apiLimiter, sanitizeBody } from "./middleware/security.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1); // Railway/Render sit behind one proxy: needed for correct client IPs in rate limits
app.disable("x-powered-by");
app.use(securityHeaders);

// CORS: set CORS_ORIGINS (comma-separated, e.g. "https://naamb.in") to lock the API to
// your own site. Unset = open, which keeps a separately hosted front-end (Render) working.
// Auth uses Bearer tokens, not cookies, so open CORS can't be used to ride a user's login.
const allowed = (process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !allowed.length || !origin || allowed.includes(origin)) }));

// Razorpay webhook needs the raw body for its signature, so it goes before express.json()
app.post("/api/payment/webhook", express.raw({ type: "application/json", limit: "1mb" }), razorpayWebhook);

app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);

// Serve images (never let the browser guess a different file type)
app.use("/uploads", express.static("uploads", { dotfiles: "deny", index: false }));

app.use("/api", apiLimiter);
app.use(["/api/admin/login", "/api/users/login", "/api/users/register", "/api/users/google-login"], authLimiter);

// ✅ MongoDB Connection
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("MONGO_URI and JWT_SECRET must be set");
  process.exit(1);
}

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

// Upload errors (wrong file type / too large) and any other unhandled error
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Image must be under 5 MB" });
  if (err?.message?.startsWith("Only JPG")) return res.status(400).json({ message: err.message });
  if (err?.type === "entity.too.large") return res.status(413).json({ message: "Request too large" });
  if (err?.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" });
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

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

