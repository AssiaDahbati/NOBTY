const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");

// POST /api/appeals
const submitAppeal = async (req, res) => {
  try {
    const { name, email, reason, details, businessId } = req.body;

    if (!name || !email || !reason || !details) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appeal = await Appeal.create({
      userId: req.user ? req.user._id : null,
      businessId: businessId || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      reason: reason.trim(),
      details: details.trim(),
    });

    return res.status(201).json({
      message: "Appeal submitted successfully",
      data: appeal,
    });
  } catch (error) {
    console.error("submitAppeal error:", error);
    return res.status(500).json({ message: "Server error while submitting appeal" });
  }
};

// GET /api/appeals
const getAllAppeals = async (req, res) => {
  try {
    const appeals = await Appeal.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email role")
      .populate("businessId", "businessName email");

    return res.status(200).json(appeals);
  } catch (error) {
    console.error("getAllAppeals error:", error);
    return res.status(500).json({ message: "Server error while fetching appeals" });
  }
};

// GET /api/appeals/my-appeals
const getMyAppeals = async (req, res) => {
  try {
    const appeals = await Appeal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(appeals);
  } catch (error) {
    console.error("getMyAppeals error:", error);
    return res.status(500).json({ message: "Server error while fetching your appeals" });
  }
};

// PATCH /api/appeals/:id/status
const updateAppealStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appeal ID" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedAppeal = await Appeal.findByIdAndUpdate(
      id,
      {
        status,
        adminNote: adminNote ? adminNote.trim() : "",
        reviewedAt: new Date(),
      },
      { new: true }
    )
      .populate("userId", "name email role")
      .populate("businessId", "businessName email");

    if (!updatedAppeal) {
      return res.status(404).json({ message: "Appeal not found" });
    }

    return res.status(200).json({
      message: `Appeal ${status} successfully`,
      data: updatedAppeal,
    });
  } catch (error) {
    console.error("updateAppealStatus error:", error);
    return res.status(500).json({ message: "Server error while updating appeal" });
  }
};

module.exports = {
  submitAppeal,
  getAllAppeals,
  getMyAppeals,
  updateAppealStatus,
};