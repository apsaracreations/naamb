import Client from "../models/Client.js";

// 📤 Add new client
export const addClient = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const newClient = new Client({ name, image });
    await newClient.save();

    res.status(201).json({ message: "Client added successfully", client: newClient });
  } catch (error) {
    res.status(500).json({ message: "Error adding client", error });
  }
};

// 📥 Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

// ❌ Delete client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error });
  }
};
