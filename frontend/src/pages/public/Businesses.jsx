import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Building2,
  Star,
  Clock3,
  Heart,
  CalendarDays,
  ChevronDown,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  Grid3X3,
  List,
  Filter,
  MapPinned,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from "lucide-react";

import api from "../../api/axios";
import video1 from "../../assets/video1.mp4";
import Footer from "../../components/Footer";

const ITEMS_PER_PAGE = 9;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80";

const CITY_OPTIONS = [
  { value: "Casablanca", label: "Casablanca" },
  { value: "Rabat", label: "Rabat" },
  { value: "Tangier", label: "Tangier" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Beauty Salon", label: "Beauty Salon" },
  { value: "Clinic", label: "Clinic" },
  { value: "Hospital", label: "Hospital" },
  { value: "Bank", label: "Bank" },
  { value: "Government Service", label: "Government Service" },
  { value: "Embassy / Consulate", label: "Embassy / Consulate" },
  { value: "Medical Lab", label: "Medical Lab" },
  { value: "Language Test Center", label: "Language Test Center" },
  { value: "Spa", label: "Spa" },
];

const SORT_OPTIONS = [
  { value: "Newest first", label: "Newest first" },
  { value: "Highest Rated", label: "Highest Rated" },
  { value: "Name A-Z", label: "Name A-Z" },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function getCategoryLabel(value) {
  const clean = normalize(value);

  const matched = CATEGORY_OPTIONS.find((cat) => {
    return (
      normalize(cat.value) === clean ||
      normalize(cat.label) === clean ||
      clean.includes(normalize(cat.value)) ||
      normalize(cat.value).includes(clean)
    );
  });

  return matched?.label || value || "Business";
}

function CustomSelect({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  options = [],
  compact = false,
}) {
  const [open, setOpen] = useState(false);

  const selected =
    options.find((opt) => opt.value === value) ||
    options.find((opt) => normalize(opt.value) === normalize(value));

  return (
    <div className="relative z-[1000]">
      {label && (
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between border border-slate-200 bg-white text-left shadow-sm transition hover:border-[#0a4abf]/40 hover:shadow-md ${
          compact
            ? "h-14 rounded-2xl px-4 text-sm"
            : "h-12 rounded-2xl px-4 text-[13.5px]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <Icon
              size={17}
              strokeWidth={1.8}
              className="shrink-0 text-[#0a4abf]"
            />
          )}
          <span
            className={`truncate ${
              selected ? "font-semibold text-slate-800" : "text-slate-400"
            }`}
          >
            {selected?.label || placeholder}
          </span>
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close select"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[999] cursor-default"
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-[calc(100%+8px)] z-[1001] max-h-80 w-full overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
            >
              {options.map((opt) => (
                <button
                  key={opt.value || opt.label}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                    value === opt.value
                      ? "bg-blue-50 font-semibold text-[#0a4abf]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                  {value === opt.value && (
                    <Check size={14} className="text-[#0a4abf]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarBox({ title, children }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[14px] font-bold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

function BusinessCard({ business, index }) {
  const [favorite, setFavorite] = useState(false);

  const image =
    business.mainPhoto ||
    (Array.isArray(business.photos) && business.photos[0]) ||
    FALLBACK_IMAGE;

  const rating = Number(
    business.rating || business.averageRating || business.reviewAverage || 4.8
  );

  const category = getCategoryLabel(business.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-[185px] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={business.businessName || "Business"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-[4px] bg-[#0a4abf] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Featured
        </div>

        <div className="absolute right-3 top-3 rounded-[4px] bg-[#052b55] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Available
        </div>

        <button
          type="button"
          onClick={() => setFavorite((prev) => !prev)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
        >
          <Heart
            size={17}
            className={
              favorite ? "fill-red-500 text-red-500" : "text-slate-500"
            }
          />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-[4px] bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a4abf]">
            {category}
          </span>

          <div className="flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        <Link to={`/business/${business._id}`}>
          <h3 className="line-clamp-1 text-[15px] font-bold text-slate-900 transition group-hover:text-[#0a4abf]">
            {business.businessName || "Business Name"}
          </h3>
        </Link>

        <div className="mt-2 flex items-start gap-1.5 text-[12px] leading-5 text-slate-500">
          <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">
            {business.address || business.city || "Address not provided"}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 min-h-[40px] text-[12.5px] leading-5 text-slate-500">
          {business.description ||
            "Book appointments, check availability, and manage your time with NOBTY."}
        </p>

        <div className="mt-4 grid grid-cols-3 border-y border-slate-100 py-3 text-center">
          <div>
            <Clock3 className="mx-auto mb-1 text-slate-400" size={15} />
            <p className="text-[11px] font-semibold text-slate-700">
              {business.averageWaitTime || business.waitTime || "15m"}
            </p>
            <p className="text-[10px] text-slate-400">Wait</p>
          </div>

          <div>
            <CalendarDays className="mx-auto mb-1 text-slate-400" size={15} />
            <p className="text-[11px] font-semibold text-slate-700">Today</p>
            <p className="text-[10px] text-slate-400">Open</p>
          </div>

          <div>
            <ImageIcon className="mx-auto mb-1 text-slate-400" size={15} />
            <p className="text-[11px] font-semibold text-slate-700">
              {Array.isArray(business.photos) ? business.photos.length : 1}
            </p>
            <p className="text-[10px] text-slate-400">Photos</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/business/${business._id}`}
            className="text-[12px] font-bold text-[#0a4abf] transition hover:underline"
          >
            View Details
          </Link>

          <Link
            to={`/business/${business._id}`}
            className="rounded-[4px] bg-[#0a4abf] px-4 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#083c9f]"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Casablanca");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest first");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (!selectedCity) return;

    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/businesses?city=${encodeURIComponent(selectedCity)}`,
          { signal: controller.signal }
        );

        if (!cancelled) {
          setBusinesses(Array.isArray(res.data) ? res.data : []);
          setCurrentPage(1);
        }
      } catch (err) {
        if (
          cancelled ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED"
        ) {
          return;
        }

        if (err?.response?.status === 429) {
          setError("Too many requests. Please wait a few seconds and try again.");
        } else {
          setError("Failed to load businesses.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCity]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const cat = normalize(selectedCategory);

    const result = businesses.filter((business) => {
      const businessCategory = normalize(business.category);

      const matchCategory =
        !selectedCategory ||
        businessCategory === cat ||
        businessCategory.includes(cat) ||
        cat.includes(businessCategory);

      const matchSearch =
        !q ||
        business.businessName?.toLowerCase().includes(q) ||
        business.description?.toLowerCase().includes(q) ||
        business.address?.toLowerCase().includes(q) ||
        business.city?.toLowerCase().includes(q) ||
        business.category?.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Highest Rated") {
        return (
          Number(b.rating || b.averageRating || 0) -
          Number(a.rating || a.averageRating || 0)
        );
      }

      if (sortBy === "Name A-Z") {
        return (a.businessName || "").localeCompare(b.businessName || "");
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [businesses, selectedCategory, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) return [1, 2, 3, 4, 5];

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [currentPage, totalPages]);

  const handlePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 760, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-[#f6f8fc]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <section className="relative min-h-[720px] overflow-visible bg-[#0a4abf]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video1} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-[#052b55]/95 via-[#0a4abf]/85 to-[#0a4abf]/60" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[8%] top-[15%] h-[2px] w-[70%] rotate-[-10deg] bg-white/40" />
          <div className="absolute left-[5%] top-[55%] h-[2px] w-[60%] rotate-[8deg] bg-white/30" />
          <div className="absolute left-[30%] top-[5%] h-[90%] w-[2px] rotate-[16deg] bg-white/20" />
          <div className="absolute left-[70%] top-[10%] h-[90%] w-[2px] rotate-[-12deg] bg-white/20" />
        </div>

        <div className="relative z-20 mx-auto flex min-h-[720px] max-w-7xl flex-col justify-center px-6 pb-24 pt-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md"
            >
              <MapPinned size={16} className="text-cyan-300" />

              <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-white">
                Find trusted providers
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-7 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl"
            >
              Find & book the best
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                businesses near you
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7 max-w-2xl text-lg leading-9 text-blue-100"
            >
              Nobty connects you with trusted local businesses. Browse by city,
              filter by category, and book your appointment in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex flex-wrap gap-10"
            >
              <div>
                <h3 className="text-5xl font-black text-white">500+</h3>
                <p className="mt-2 text-sm text-blue-100">Businesses</p>
              </div>

              <div>
                <h3 className="text-5xl font-black text-white">12k+</h3>
                <p className="mt-2 text-sm text-blue-100">Bookings</p>
              </div>

              <div>
                <h3 className="text-5xl font-black text-white">4.8★</h3>
                <p className="mt-2 text-sm text-blue-100">Avg rating</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="relative z-[999] mt-16 w-full max-w-6xl"
          >
            <div className="rounded-[30px] border border-white/20 bg-white/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.4fr_auto]">
                <CustomSelect
                  icon={MapPin}
                  placeholder="Choose a city"
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={CITY_OPTIONS}
                  compact
                />

                <CustomSelect
                  icon={Building2}
                  placeholder="All categories"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={CATEGORY_OPTIONS}
                  compact
                />

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, address..."
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-[14px] outline-none transition placeholder:text-slate-400 focus:border-[#0a4abf] focus:ring-4 focus:ring-[#0a4abf]/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#0a4abf] px-10 text-sm font-bold text-white shadow-xl shadow-blue-900/25 transition duration-300 hover:scale-[1.02] hover:bg-[#083c9f]"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-[14%] top-[22%] hidden h-16 w-16 items-center justify-center rounded-full bg-[#0a4abf] text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:flex"
        >
          <Navigation size={24} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute right-[28%] top-[42%] hidden h-12 w-12 items-center justify-center rounded-full bg-white text-[#0a4abf] shadow-xl lg:flex"
        >
          <MapPin size={18} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
          className="absolute left-[58%] top-[30%] hidden rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0a4abf] shadow-xl lg:block"
        >
          {filtered.length || businesses.length} results
        </motion.div>
      </section>

      <section className="relative z-10 pb-20 pt-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 lg:grid-cols-[260px_1fr]">
          <aside className="hidden space-y-6 lg:block">
            <SidebarBox title="Categories">
              <div className="space-y-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <label
                    key={cat.value || "all"}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                      selectedCategory === cat.value
                        ? "border-[#0a4abf] bg-blue-50 text-[#0a4abf]"
                        : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                      className="h-4 w-4 accent-[#0a4abf]"
                    />

                    <span className="font-medium">{cat.label}</span>
                  </label>
                ))}
              </div>
            </SidebarBox>

            <SidebarBox title="Cities">
              <div className="space-y-2">
                {CITY_OPTIONS.map((city) => (
                  <label
                    key={city.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                      selectedCity === city.value
                        ? "border-[#0a4abf] bg-blue-50 text-[#0a4abf]"
                        : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="city"
                      checked={selectedCity === city.value}
                      onChange={() => setSelectedCity(city.value)}
                      className="h-4 w-4 accent-[#0a4abf]"
                    />

                    <span className="font-medium">{city.label}</span>
                  </label>
                ))}
              </div>
            </SidebarBox>
          </aside>

          <main>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-400">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} in{" "}
                  {selectedCity || "Morocco"}
                </p>
                <h2 className="mt-1 text-[30px] font-extrabold tracking-tight text-[#08214a]">
                  Explore Businesses
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <ArrowUpDown size={16} />
                </div>

                <div className="w-[190px]">
                  <CustomSelect
                    icon={SlidersHorizontal}
                    placeholder="Sort by"
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    compact
                  />
                </div>

                <div className="flex overflow-hidden rounded-[4px] border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex h-11 w-11 items-center justify-center ${
                      viewMode === "grid"
                        ? "bg-[#0a4abf] text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex h-11 w-11 items-center justify-center ${
                      viewMode === "list"
                        ? "bg-[#0a4abf] text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-[4px] border border-slate-200 bg-white p-3 text-[12px] font-medium text-slate-500 lg:hidden">
              <Filter size={15} className="text-[#0a4abf]" />
              Use the search bar above to filter by city, category, or name.
            </div>

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="h-[185px] animate-pulse bg-slate-200" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                      <div className="h-10 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-[6px] border border-red-200 bg-red-50 px-5 py-5 text-[14px] font-semibold text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-[6px] border border-slate-200 bg-white py-20 text-center shadow-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Building2 size={28} className="text-[#0a4abf]" />
                </div>

                <p className="text-[16px] font-bold text-slate-800">
                  No businesses found
                </p>

                <p className="mt-1 text-[13px] text-slate-400">
                  Try changing the city, category, or search keyword.
                </p>
              </motion.div>
            )}

            {!loading && !error && paginated.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid gap-6"
                  }
                >
                  {paginated.map((business, index) => (
                    <BusinessCard
                      key={business._id || index}
                      business={business}
                      index={index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {visiblePages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePage(page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold transition ${
                          currentPage === page
                            ? "bg-[#0a4abf] text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}