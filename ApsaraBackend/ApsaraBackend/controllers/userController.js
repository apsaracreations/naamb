import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === "string" ? v.trim() : "");

// Case-insensitive exact match: older accounts may have capitals in the stored email
const escapeRe = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const findByEmail = (raw) => User.findOne({ email: new RegExp(`^${escapeRe(raw)}$`, "i") });

const issueToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5d" });

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

// 🌐 Google Login/Signup
export const googleLogin = async (req, res) => {
  try {
    const idToken = str(req.body.idToken);
    if (!idToken) return res.status(400).json({ message: "Google token missing" });

    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const { name, email, sub, email_verified } = ticket.getPayload();
    // Only trust Google emails Google itself has verified (stops account takeover)
    if (!email || !email_verified) return res.status(401).json({ message: "Google email not verified" });

    let user = await findByEmail(email);
    if (!user) user = await User.create({ name: name || email, email: email.toLowerCase(), googleId: sub });
    else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    res.status(200).json({ message: "Google login successful", token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

// 🧍 Register user
export const registerUser = async (req, res) => {
  try {
    const name = str(req.body.name);
    const email = str(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ message: "Enter a valid email" });
    if (password.length < 6 || password.length > 128)
      return res.status(400).json({ message: "Password must be 6–128 characters long" });

    const existingUser = await findByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name: name.slice(0, 100), email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// 🔐 Login user
export const loginUser = async (req, res) => {
  try {
    const email = str(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password) return res.status(400).json({ message: "Invalid email or password" });

    const user = await findByEmail(email);
    // Google-only accounts have no password: same generic message, no crash
    const isMatch = user?.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
