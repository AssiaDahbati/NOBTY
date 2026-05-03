import React, { useState } from "react";
import StarRating from "./StarRating";
import { replyToReview } from "../../services/reviewService";
import { MessageSquare, Send, ShieldCheck } from "lucide-react";

function getDisplayName(user) {
  if (!user) return "Anonymous";

  if (user.fullName) return user.fullName;
  if (user.name) return user.name;

  if (user.email) {
    const [name] = user.email.split("@");
    return name.slice(0, 1).toUpperCase() + name.slice(1, 6);
  }

  return "Anonymous";
}

function getInitial(user) {
  return getDisplayName(user).charAt(0).toUpperCase();
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function ReviewsList({
  reviews = [],
  canReply = false,
  onReplySuccess,
}) {
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyError, setReplyError] = useState({});

  const handleReply = async (e, reviewId) => {
    e.preventDefault();

    const text = (replyText[reviewId] || "").trim();

    if (!text) {
      setReplyError((prev) => ({
        ...prev,
        [reviewId]: "Reply cannot be empty.",
      }));
      return;
    }

    try {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: true,
      }));

      setReplyError((prev) => ({
        ...prev,
        [reviewId]: "",
      }));

      await replyToReview(reviewId, { text });

      setReplyText((prev) => ({
        ...prev,
        [reviewId]: "",
      }));

      if (onReplySuccess) {
        onReplySuccess();
      }
    } catch (error) {
      console.error("Reply error:", error);
      setReplyError((prev) => ({
        ...prev,
        [reviewId]:
          error.response?.data?.message || "Failed to submit reply.",
      }));
    } finally {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: false,
      }));
    }
  };

  if (!reviews.length) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">No reviews yet</p>
        <p className="mt-2 text-sm text-slate-500">
          Customer feedback will appear here once users leave reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* LEFT */}
            <div className="flex min-w-[220px] items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                {getInitial(review.user)}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {getDisplayName(review.user)}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(review.createdAt)}
                </p>

                <div className="mt-3">
                  <StarRating rating={review.rating} size="text-xl" />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {review.comment || "No comment provided."}
                </p>
              </div>

              {/* EXISTING REPLY */}
              {review.reply?.text && (
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Verified business reply
                    </p>
                  </div>

                  <p className="text-sm leading-7 text-slate-700">
                    {review.reply.text}
                  </p>

                  {review.reply?.createdAt && (
                    <p className="mt-2 text-xs text-slate-500">
                      Replied on {formatDate(review.reply.createdAt)}
                    </p>
                  )}
                </div>
              )}

              {/* REPLY FORM FOR DASHBOARD ONLY */}
              {canReply && !review.reply?.text && (
                <form
                  onSubmit={(e) => handleReply(e, review._id)}
                  className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquare size={16} className="text-slate-700" />
                    <p className="text-sm font-semibold text-slate-800">
                      Reply as business owner
                    </p>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Write a professional reply..."
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                    value={replyText[review._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [review._id]: e.target.value,
                      }))
                    }
                  />

                  {replyError[review._id] && (
                    <p className="mt-2 text-sm text-red-600">
                      {replyError[review._id]}
                    </p>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={replyLoading[review._id]}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      <Send size={15} />
                      {replyLoading[review._id] ? "Replying..." : "Post Reply"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}