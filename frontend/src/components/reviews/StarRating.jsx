import React from "react";

export default function StarRating({
  rating = 0,
  setRating,
  interactive = false,
  size = "text-xl",
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating && setRating(star)}
          className={`${size} transition ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
}