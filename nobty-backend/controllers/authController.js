const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      businessName,
      category,
      city,
    } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({
        error: "Full name, email, phone, password, and role are required.",
      });
    }

    if (!["user", "business_owner", "admin"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role.",
      });
    }

    if (role === "business_owner") {
      if (!businessName || !category || !city) {
        return res.status(400).json({
          error: "Business name, category, and city are required for business owners.",
        });
      }
    }

    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
      return res.status(400).json({
        error: "Email already in use.",
      });
    }

    const existingUserByPhone = await User.findOne({ phone: normalizedPhone });
    if (existingUserByPhone) {
      return res.status(400).json({
        error: "Phone number already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role,
    });

    const token = createToken(user);

    return res.status(201).json({
      message:
        role === "business_owner"
          ? "Account created successfully. Continue to complete your business profile."
          : "Account created successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      error: "Server error during registration.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      error: "Server error during login.",
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("me error:", error);
    return res.status(500).json({
      error: "Server error while fetching user.",
    });
  }
};

module.exports = {
  register,
  login,
  me,
};