import User from "../models/User.js";
import { validationError } from "../middleware/errorHandler.js";

function serializeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName || "",
    phone: user.phone || "",
    createdAt: user.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role, businessName, phone } = req.body;
    const errors = {};
    if (!name?.trim()) errors.name = "Full name is required.";
    if (!email?.trim()) errors.email = "Email is required.";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (role === "donor" && !businessName?.trim()) {
      errors.businessName = "Business name is required for food donors.";
    }
    if (Object.keys(errors).length) throw validationError(errors);

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // In production, hash with bcrypt
      role: role || "donor",
      businessName: businessName?.trim() || "",
      phone: phone?.trim() || "",
    });

    res.status(201).json(serializeUser(user));
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
}
