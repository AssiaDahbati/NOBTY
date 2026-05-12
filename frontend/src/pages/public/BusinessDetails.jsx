import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Heart,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Info,
  MessageCircle,
  Share2,
  BadgeCheck,
  Image as ImageIcon,
  Sparkles,
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

function renderStars(rating = 0, size = 15) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.round(safeRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
}

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedService, setSelectedService] = useState(null);

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

  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] px-4 py-10">
        <div className="mx-auto max-w-[1180px] animate-pulse space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="aspect-[4/5] rounded-[32px] bg-white" />
            <div className="rounded-[32px] bg-white" />
          </div>
          <div className="h-80 rounded-[32px] bg-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!business) return null;

  const avgRating = Number(reviewsData.avgRating || business.rating || 4.8);
  const totalReviews = Number(reviewsData.totalReviews || 0);

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#141414]">
      <main className="mx-auto max-w-[1180px] px-4 py-6 md:px-8 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          <button onClick={() => navigate("/")} className="hover:text-black">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/businesses")}
            className="hover:text-black"
          >
            Businesses
          </button>
          <span>/</span>
          <span className="line-clamp-1 text-slate-700">
            {business.name || business.businessName}
          </span>
        </div>

        {/* Main detail */}
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-[28px] bg-white shadow-sm">
              <img
                src={gallery[activeImageIndex]}
                alt={business.name || business.businessName}
                className="aspect-[4/5] w-full object-cover"
              />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-slate-900 shadow">
                  <BadgeCheck size={14} className="text-[#0a4abf]" />
                  Verified
                </span>

                <span className="rounded-full bg-black px-3 py-2 text-xs font-black text-white shadow">
                  Featured
                </span>
              </div>

              <button
                onClick={() => setIsFavorite((prev) => !prev)}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
                type="button"
              >
                <Heart
                  size={18}
                  className={
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-slate-500"
                  }
                />
              </button>

              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={handlePrevImage}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow transition hover:bg-slate-100"
                  type="button"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleNextImage}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow transition hover:bg-slate-100"
                  type="button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow">
                {activeImageIndex + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.slice(0, 4).map((img, index) => (
                <button
                  key={img + index}
                  onClick={() => setActiveImageIndex(index)}
                  type="button"
                  className={`overflow-hidden rounded-[18px] border bg-white p-1 transition ${
                    activeImageIndex === index
                      ? "border-black"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="aspect-[4/5] w-full rounded-[14px] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
              <p className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700">
                {business.category || "Business"}
              </p>

              <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-black md:text-5xl">
                {business.name || business.businessName}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {renderStars(avgRating, 16)}
                <span className="font-black text-black">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-400">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-slate-500">
                <MapPin size={18} className="mt-0.5 shrink-0 text-black" />
                <span>
                  {business.address || business.city || "Address not provided"}
                </span>
              </div>

              <p className="mt-6 text-[15px] leading-8 text-slate-600">
                {business.description ||
                  "Explore services, compare details, and book your appointment easily with NOBTY."}
              </p>

              <div className="mt-7 rounded-2xl border border-slate-200 bg-[#fafafa] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Clock3 size={18} className="text-black" />
                    <p className="mt-3 text-2xl font-black">
                      {business.bookingInterval || 30}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Minutes per slot
                    </p>
                  </div>

                  <div>
                    <CalendarDays size={18} className="text-black" />
                    <p className="mt-3 text-2xl font-black">
                      {services.length}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Bookable services
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking box */}
              <div className="mt-7 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Selected service
                    </p>
                    <h3 className="mt-2 text-xl font-black text-black">
                      {selectedService?.name || "Choose a service"}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400">From</p>
                    <p className="text-2xl font-black text-black">
                      {selectedService
                        ? formatPriceMAD(selectedService.price)
                        : "—"}
                    </p>
                  </div>
                </div>

                {services.length > 0 && (
                  <select
                    value={selectedService?._id || ""}
                    onChange={(e) => {
                      const found = services.find(
                        (s) => s._id === e.target.value
                      );
                      setSelectedService(found);
                    }}
                    className="mt-5 h-12 w-full rounded-full border border-slate-200 bg-[#fafafa] px-4 text-sm font-bold outline-none focus:border-black"
                  >
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} — {formatPriceMAD(service.price)}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  disabled={!selectedService}
                  onClick={() =>
                    selectedService && navigate(`/book/${selectedService._id}`)
                  }
                  className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white transition hover:bg-[#0a4abf] disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  <CalendarDays size={18} />
                  Book appointment
                </button>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    type="button"
                  >
                    <MessageCircle size={16} />
                    Contact
                  </button>

                  <button
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    type="button"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Tabs and rating */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
            <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
              {[
                { id: "description", label: "Description" },
                { id: "reviews", label: `Reviews (${totalReviews})` },
                { id: "info", label: "Additional Information" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 pb-4 text-sm font-black transition ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-slate-400 hover:text-black"
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <div className="py-8">
                <h2 className="text-3xl font-black tracking-[-0.04em]">
                  About this business
                </h2>

                <p className="mt-5 max-w-3xl text-[15px] leading-8 text-slate-600">
                  {business.description ||
                    "This business offers bookable services through NOBTY. Customers can explore services, choose a time, and confirm their appointment quickly."}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    "Online booking available",
                    "Verified business profile",
                    "Transparent service details",
                    "Easy appointment scheduling",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafafa] p-4"
                    >
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="text-sm font-bold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="py-8">
                {reviewsLoading ? (
                  <div className="rounded-2xl bg-[#fafafa] p-8 text-slate-500">
                    Loading reviews...
                  </div>
                ) : (
                  <ReviewsList reviews={reviewsData.reviews} />
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div className="grid gap-5 py-8 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-5">
                  <Info size={18} className="text-black" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Category
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {business.category || "Business"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-5">
                  <MapPin size={18} className="text-black" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    City
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {business.city || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-5">
                  <Clock3 size={18} className="text-black" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Booking interval
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {business.bookingInterval || 30} minutes
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-5">
                  <ImageIcon size={18} className="text-black" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Photos
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {gallery.length}
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[28px] bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Ratings</h3>
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm font-black text-yellow-700">
                {avgRating.toFixed(1)}
              </span>
            </div>

            <div className="mt-5">
              <RatingSummary
                avgRating={reviewsData.avgRating}
                totalReviews={reviewsData.totalReviews}
              />
            </div>
          </aside>
        </section>

        {/* Services */}
        <section className="mt-10 rounded-[28px] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                Bookable services
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                Choose your service
              </h2>
            </div>

            <span className="rounded-full bg-[#fafafa] px-4 py-2 text-sm font-bold text-slate-500">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <article
                  key={service._id}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-slate-100">
                    <img
                      src={
                        service.image ||
                        "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={service.name}
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow">
                      Service #{index + 1}
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-full bg-black px-4 py-2 text-sm font-black text-white shadow">
                      {formatPriceMAD(service.price)}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-black text-black">
                      {service.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {service.description || "No description available."}
                    </p>

                    <button
                      onClick={() => navigate(`/book/${service._id}`)}
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white transition hover:bg-[#0a4abf]"
                      type="button"
                    >
                      <CalendarDays size={16} />
                      Book this service
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fafafa] px-6 py-16 text-center text-slate-500">
              No services available.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}