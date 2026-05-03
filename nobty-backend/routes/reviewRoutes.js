const express = require("express");
const router = express.Router();

const {
  createReview,
  getBusinessReviews,
  replyToReview,
} = require("../controllers/reviewController");

const { requireAuth } = require("../middleware/authMiddleware");

router.post("/", requireAuth, createReview);
router.get("/business/:id", getBusinessReviews);
router.post("/:reviewId/reply", requireAuth, replyToReview);

module.exports = router;