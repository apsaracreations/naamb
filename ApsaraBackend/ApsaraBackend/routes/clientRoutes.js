import express from "express";
import multer from "multer";
import fs from "fs";
import { addClient, getAllClients, deleteClient } from "../controllers/clientController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

fs.mkdirSync("uploads/clients", { recursive: true });

// 🧩 Multer storage for client logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clients");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📤 Add client
router.post("/add", requireAdmin, upload.single("image"), addClient);

// 📥 Get all clients
router.get("/get", getAllClients);

// ❌ Delete client
router.delete("/delete/:id", requireAdmin, deleteClient);

export default router;
