const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { compressImage } = require("../utils/imageCompress");
const {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword
} = require("../utils/validators");

const register = async (req, res) => {
  try {
    const { name, email, password, address, role, storeName } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be 20-60 characters." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 chars, include one uppercase and one special character."
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address must be 400 characters or less." });
    }

    const validRoles = ["USER", "STORE_OWNER", "ADMIN"];
    const userRole = role && validRoles.includes(role) ? role : "USER";

    // Validate store owner specific fields
    if (userRole === "STORE_OWNER") {
      if (!storeName || storeName.trim().length === 0) {
        return res.status(400).json({ message: "Store name is required for store owners." });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Store photo is required for store owners." });
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Compress image if provided for store owner
    let storePhoto = null;
    if (userRole === "STORE_OWNER" && req.file) {
      try {
        storePhoto = await compressImage(req.file.buffer);
      } catch (err) {
        return res.status(400).json({ message: "Failed to process image. Please try a different image." });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: userRole,
        storeName: userRole === "STORE_OWNER" ? storeName : null,
        storePhoto: userRole === "STORE_OWNER" ? storePhoto : null
      },
      select: { id: true, name: true, email: true, role: true, storeName: true }
    });

    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8-16 chars, include one uppercase and one special character."
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  updatePassword
};
