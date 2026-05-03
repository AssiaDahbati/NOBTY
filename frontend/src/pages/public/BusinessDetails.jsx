import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  Clock3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Heart,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import api from "../../api/axios";
import { getBusinessReviews } from "../../services/reviewService";
import RatingSummary from "../../components/reviews/RatingSummary";
import ReviewsList from "../../components/reviews/ReviewsList";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80";

function isValidObjectId(value) {
  return /^[a-f\d]{24}$/i.test(value);
}

function formatPriceMAD(price) {
  const value = Number(price || 0);
  return `${value} MAD`;
}

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    totalReviews: 0,
    avgRating: 0,
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!id || !isValidObjectId(id)) {
          setError("Invalid business ID.");
          setLoading(false);
          return;
        }

        const res = await api.get(`/businesses/${id}`);
        setBusiness(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load business.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!id || !isValidObjectId(id)) {
          setReviewsLoading(false);
          return;
        }

        setReviewsLoading(true);
        const data = await getBusinessReviews(id);
        setReviewsData(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const gallery = useMemo(() => {
    if (!business) return [FALLBACK_IMAGE];

    const images = [
      business.mainPhoto,
      ...(Array.isArray(business.photos) ? business.photos : []),
    ].filter(Boolean);

    return images.length > 0 ? images : [FALLBACK_IMAGE];
  }, [business]);

  const services = useMemo(() => {
    return Array.isArray(business?.services) ? business.services : [];
  }, [business]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const renderStars = (rating = 0, size = 16, emptyClass = "text-gray-300") => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          const active = index < Math.round(safeRating);

          return (
            <Star
              key={index}
              size={size}
              className={active ? "fill-yellow-400 text-yellow-400" : emptyClass}
            />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faff] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-[320px] rounded-[18px] bg-white shadow-sm md:h-[420px]" />
          <div className="h-56 rounded-[18px] bg-white shadow-sm" />
          <div className="h-72 rounded-[18px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7faff] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl rounded-[18px] border border-red-200 bg-red-50 p-8 text-red-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f9ff_0%,#ffffff_35%,#fbfdff_100%)] text-[#132249]">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">
        {/* HEADER IMAGE */}
        <section className="overflow-hidden rounded-[18px] border border-[#e8eef8] bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
          <div className="relative h-[280px] bg-[#f3f7fd] md:h-[380px] xl:h-[460px]">
            <img
              src={gallery[activeImageIndex]}
              alt={business.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#132249]/8 via-transparent to-white/5" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2 md:left-6 md:top-6">
              <span className="rounded-[10px] border border-emerald-100 bg-emerald-50/95 px-4 py-2 text-xs font-semibold text-emerald-700 backdrop-blur">
                Verified
              </span>
            </div>

            <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
              <button
                type="button"
                onClick={() => setIsFavorite((prev) => !prev)}
                className={`flex h-11 w-11 items-center justify-center rounded-[12px] border backdrop-blur transition ${
                  isFavorite
                    ? "border-rose-200 bg-rose-500 text-white shadow-lg"
                    : "border-white/80 bg-white/90 text-rose-500 hover:scale-105"
                }`}
                aria-label="Toggle favorite"
              >
                <Heart
                  size={18}
                  className={isFavorite ? "fill-white" : "fill-rose-100"}
                />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-6 md:left-6">
              <button
                onClick={handlePrevImage}
                className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/80 bg-white/90 text-[#132249] shadow transition hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextImage}
                className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/80 bg-white/90 text-[#132249] shadow transition hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-[10px] border border-white/80 bg-white/90 px-4 py-2 text-xs font-semibold text-[#132249] shadow md:bottom-6 md:right-6">
                {activeImageIndex + 1} / {gallery.length}
              </div>
            )}
          </div>
        </section>

        {/* NAME + DESCRIPTION FULL WIDTH */}
        <section className="mt-8 rounded-[18px] border border-[#e8eef8] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.05)] md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[10px] bg-[#fff8e8] px-3 py-1.5 text-xs font-semibold text-[#c98a00]">
              <ShieldCheck size={14} />
              Trusted choice
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[#132249] md:text-5xl xl:text-6xl">
            {business.name}
          </h1>

          <p className="mt-6 max-w-4xl text-base leading-8 text-slate-600">
            {business.description ||
              "A premium business designed to deliver a seamless, polished, and trustworthy customer experience."}
          </p>

          {/* SMALLER STATS FULL WIDTH */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[16px] border border-[#edf2ff] bg-[#fcfdff] p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff6e7] text-[#f4a100]">
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Rating
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#132249]">
                {Number(reviewsData.avgRating || 0).toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Based on real reviews
              </p>
            </div>

            <div className="rounded-[16px] border border-[#edf2ff] bg-[#fcfdff] p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eefbf3] text-[#16a34a]">
                <Users size={16} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Capacity
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#132249]">
                {business.queueCapacity || 1}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Queue spots available
              </p>
            </div>

            <div className="rounded-[16px] border border-[#edf2ff] bg-[#fcfdff] p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f4f0ff] text-[#8b5cf6]">
                <Clock3 size={16} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Interval
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#132249]">
                {business.bookingInterval || 30}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Minutes per slot
              </p>
            </div>

            <div className="rounded-[16px] border border-[#edf2ff] bg-[#fcfdff] p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef7ff] text-[#0ea5e9]">
                <CalendarDays size={16} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Services
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#132249]">
                {services.length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ready to book
              </p>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mt-8 rounded-[18px] border border-[#e8eef8] bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.05)] md:p-7">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1f57d2]">
                Clean, clear, bookable
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#132249] md:text-4xl">
                Services
              </h2>
            </div>

            <div className="rounded-[10px] bg-[#f8fbff] px-4 py-2 text-sm font-medium text-slate-500">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </div>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service._id}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[#edf2ff] bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(31,87,210,0.10)]"
                >
                  <div className="relative h-56 overflow-hidden bg-[#f3f7fd]">
                    <img
                      src={
                        service.image ||
                        "https://via.placeholder.com/400x220?text=Service"
                      }
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#132249]/45 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 rounded-[10px] bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#132249] shadow">
                      Service #{index + 1}
                    </div>

                    <div className="absolute bottom-4 right-4 rounded-[12px] bg-white px-4 py-2 text-sm font-black text-[#16a34a] shadow">
                      {formatPriceMAD(service.price)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-2xl font-black tracking-[-0.03em] text-[#132249]">
                      {service.name}
                    </h3>

                    <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-600">
                      {service.description || "No description available."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-[10px] bg-[#eefbf3] px-3 py-1.5 text-xs font-semibold text-[#18794e]">
                        Available now
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/book/${service._id}`)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#132249] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0f1b3d]"
                    >
                      <CalendarDays size={16} className="text-emerald-300" />
                      Book this service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[#d8e4fb] bg-[#fafcff] px-6 py-14 text-center text-slate-500">
              No services available.
            </div>
          )}
        </section>

        {/* REVIEWS SUMMARY UNDER SERVICES */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[18px] border border-[#e8eef8] bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.05)] md:p-7">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#c98a00]">
                  Review summary
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#132249]">
                  Ratings
                </h2>
              </div>

              <div className="rounded-[10px] bg-[#fff8e8] px-4 py-2 text-sm font-bold text-[#c98a00]">
                {Number(reviewsData.avgRating || 0).toFixed(1)}
              </div>
            </div>

            <div className="rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">
              <RatingSummary
                avgRating={reviewsData.avgRating}
                totalReviews={reviewsData.totalReviews}
              />
            </div>
          </section>

          <section className="rounded-[18px] border border-[#e8eef8] bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.05)] md:p-7">
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#1f57d2]">
                Customer voices
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#132249]">
                Latest feedback
              </h2>
            </div>

            {reviewsLoading ? (
              <div className="rounded-[14px] border border-[#e8eef8] bg-[#fafcff] p-6 text-slate-500">
                Loading reviews...
              </div>
            ) : (
              <div className="rounded-[14px] bg-[#fcfdff] p-2">
                <ReviewsList reviews={reviewsData.reviews} />
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}