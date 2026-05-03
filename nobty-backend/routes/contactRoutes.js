const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markAsRead,
  replyToMessage,
  getMyMessages,
  getUnreadReplyCount,
  markReplyAsSeen,
} = require("../controllers/contactController");

const optionalAuth = require("../middleware/optionalAuth");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// Public or logged-in contact form
router.post("/", optionalAuth, sendMessage);

// Logged-in user inbox
router.get("/my-messages", requireAuth, getMyMessages);
router.get("/my-messages/unread-count", requireAuth, getUnreadReplyCount);
router.patch("/my-messages/:id/seen", requireAuth, markReplyAsSeen);

// Admin
router.get("/", requireAuth, requireAdmin, getMessages);
router.patch("/:id/read", requireAuth, requireAdmin, markAsRead);
router.patch("/:id/reply", requireAuth, requireAdmin, replyToMessage);

module.exports = router;