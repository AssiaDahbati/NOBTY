const express = require("express");
const router = express.Router();

const {
  submitAppeal,
  getAllAppeals,
  getMyAppeals,
  updateAppealStatus,
} = require("../controllers/appealController");

const optionalAuth = require("../middleware/optionalAuth");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.post("/", optionalAuth, submitAppeal);
router.get("/my-appeals", requireAuth, getMyAppeals);

router.get("/", requireAuth, requireAdmin, getAllAppeals);
router.patch("/:id/status", requireAuth, requireAdmin, updateAppealStatus);

module.exports = router;