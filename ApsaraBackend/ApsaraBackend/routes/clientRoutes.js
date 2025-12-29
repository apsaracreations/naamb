import express from "express";
import multer from "multer";
import path from "path";
import { addClient, getAllClients, deleteClient } from "../controllers/clientController.js";

const router = express.Router();

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
router.post("/add", upload.single("image"), addClient);

// 📥 Get all clients
router.get("/get", getAllClients);

// ❌ Delete client
router.delete("/delete/:id", deleteClient);

export default router;
