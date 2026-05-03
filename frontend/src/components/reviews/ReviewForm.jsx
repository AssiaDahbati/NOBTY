import React, { useState } from "react";
import StarRating from "./StarRating";
import { createReview } from "../../services/reviewService";

export default function ReviewForm({ appointmentId, onReviewCreated }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      const newReview = await createReview({
        rating,
        comment,
        appointmentId,
      });

      setSuccess("Review submitted successfully.");
      setRating(0);
      setComment("");

      if (onReviewCreated) {
        onReviewCreated(newReview);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Leave a Review
      </h3>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Rating
        </label>
        <StarRating
          rating={rating}
          setRating={setRating}
          interactive={true}
          size="text-2xl"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          maxLength={500}
          placeholder="Share your experience..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-black px-5 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}