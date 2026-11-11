import express from "express";
import { imageUpload } from "../middleware/imageUpload.js";
import { addClient, getAllClients, deleteClient } from "../controllers/clientController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = imageUpload("clients");

// 📤 Add client
router.post("/add", requireAdmin, upload.single("image"), addClient);

// 📥 Get all clients
router.get("/get", getAllClients);

// ❌ Delete client
router.delete("/delete/:id", requireAdmin, deleteClient);

export default router;
