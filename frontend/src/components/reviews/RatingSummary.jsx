import React from "react";
import StarRating from "./StarRating";

export default function RatingSummary({ avgRating = 0, totalReviews = 0 }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {avgRating || 0}
            </span>
            <StarRating rating={Math.round(avgRating)} size="text-2xl" />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </div>
      </div>
    </div>
  );
}