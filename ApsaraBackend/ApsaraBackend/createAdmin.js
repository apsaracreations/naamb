import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const username = "ApsaraCreations";
    const password = "Krishnak@9656";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
