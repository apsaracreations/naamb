import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const readToken = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

// Admin-only routes (product/category/blog/client/order management)
export const requireAdmin = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ message: "Admin login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const admin = await Admin.findById(decoded.id).select("_id");
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};

// Logged-in customer routes (cart, own orders, checkout)
export const requireUser = (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ message: "Please login to continue" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") return res.status(403).json({ message: "Customer account required" });

    req.user = { id: String(decoded.id) };
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};

// Blocks a customer from reading or changing another customer's cart/orders
export const sameUser = (source) => (req, res, next) => {
  const userId = source === "body" ? req.body?.userId : req.params.userId;
  if (userId && String(userId) !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
};
