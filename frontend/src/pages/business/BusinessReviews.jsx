import React, { useEffect, useState } from "react";
import { getMyBusiness } from "../../services/businessServiceManager";
import { getBusinessReviews } from "../../services/reviewService";
import ReviewsList from "../../components/reviews/ReviewsList";
import { Star, MessageSquareText, TrendingUp } from "lucide-react";

export default function BusinessReviews() {
  const [businessId, setBusinessId] = useState("");
  const [data, setData] = useState({
    reviews: [],
    totalReviews: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (id) => {
    try {
      setLoading(true);
      const res = await getBusinessReviews(id);
      setData(res);
    } catch (error) {
      console.error("Failed to fetch business reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBusinessAndReviews = async () => {
      try {
        const business = await getMyBusiness();
        setBusinessId(business._id);
        await fetchReviews(business._id);
      } catch (error) {
        console.error("Failed to load business reviews:", error);
        setLoading(false);
      }
    };

    loadBusinessAndReviews();
  }, []);

  const roundedRating = Math.round(data.avgRating || 0);

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Reviews</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Customer feedback
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor public reviews, understand customer satisfaction, and
              reply professionally as a verified business.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Live review dashboard
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Loading reviews...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Reviews</p>
                  <h3 className="mt-2 text-4xl font-bold text-slate-900">
                    {data.totalReviews}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400">
                    All submitted customer reviews
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <MessageSquareText size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Average Rating</p>
                  <div className="mt-2 flex items-center gap-3">
                    <h3 className="text-4xl font-bold text-slate-900">
                      {Number(data.avgRating || 0).toFixed(1)}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={star <= roundedRating ? "currentColor" : "none"}
                          className={
                            star <= roundedRating
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Overall satisfaction score
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <Star size={22} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Reputation Status</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {data.avgRating >= 4.5
                      ? "Excellent"
                      : data.avgRating >= 4
                      ? "Strong"
                      : data.avgRating >= 3
                      ? "Average"
                      : "Needs work"}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400">
                    Based on current review sentiment
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Review activity
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Read comments and post a public business reply.
                </p>
              </div>
            </div>

            <ReviewsList
              reviews={data.reviews}
              canReply={true}
              onReplySuccess={() => fetchReviews(businessId)}
              variant="dashboard"
            />
          </div>
        </>
      )}
    </div>
  );
}