const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const Business = require("../models/Business");

const createReview = async (req, res) => {
  try {
    const { rating, comment, appointmentId } = req.body;
    const userId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed appointments" });
    }

    const existingReview = await Review.findOne({ appointment: appointmentId });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this appointment" });
    }

    const review = await Review.create({
      rating,
      comment,
      user: userId,
      business: appointment.business,
      appointment: appointmentId,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "email"
    );

    res.status(201).json({
      message: "Review submitted successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBusinessReviews = async (req, res) => {
  try {
    const businessId = req.params.id;

    const reviews = await Review.find({ business: businessId })
      .populate("user", "email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const avgRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    res.json({
      reviews,
      totalReviews,
      avgRating: Number(avgRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const business = await Business.findById(review.business);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.reply = {
      text: text.trim(),
      createdAt: new Date(),
    };

    await review.save();

    const updatedReview = await Review.findById(review._id).populate(
      "user",
      "email"
    );

    res.status(200).json({
      message: "Reply added successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Reply To Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getBusinessReviews,
  replyToReview,
};