const mongoose = require("mongoose");
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      userId: req.user ? req.user._id : null,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res
      .status(500)
      .json({ message: "Server error while sending message" });
  }
};

// GET /api/contact
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email role");

    return res.status(200).json(messages);
  } catch (error) {
    console.error("getMessages error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching messages" });
  }
};

// PATCH /api/contact/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({
      message: "Message marked as read",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res
      .status(500)
      .json({ message: "Server error while marking message as read" });
  }
};

// PATCH /api/contact/:id/reply
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!adminReply || !adminReply.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      {
        adminReply: adminReply.trim(),
        repliedAt: new Date(),
        isRead: true,
        userHasSeenReply: false,
      },
      { new: true }
    ).populate("userId", "name email role");

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({
      message: "Reply sent successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("replyToMessage error:", error);
    return res
      .status(500)
      .json({ message: "Server error while replying to message" });
  }
};

// GET /api/contact/my-messages
const getMyMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("getMyMessages error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching your messages" });
  }
};

// GET /api/contact/my-messages/unread-count
const getUnreadReplyCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({
      userId: req.user._id,
      adminReply: { $ne: "" },
      userHasSeenReply: false,
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error("getUnreadReplyCount error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching unread reply count" });
  }
};

// PATCH /api/contact/my-messages/:id/seen
const markReplyAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const updatedMessage = await ContactMessage.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        userHasSeenReply: true,
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({
      message: "Reply marked as seen",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("markReplyAsSeen error:", error);
    return res
      .status(500)
      .json({ message: "Server error while marking reply as seen" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  replyToMessage,
  getMyMessages,
  getUnreadReplyCount,
  markReplyAsSeen,
};