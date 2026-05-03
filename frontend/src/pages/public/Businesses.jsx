import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

import {
  MapPin, Search, Building2, Star, Users, Clock3, Heart,
  CalendarDays, ChevronDown, Check, SlidersHorizontal,
  ArrowUpDown, Sparkles, Image as ImageIcon, ChevronLeft,
  ChevronRight, TrendingUp,
} from "lucide-react";
import api from "../../api/axios";
import video1 from "../../assets/video1.mp4";
import Footer from "../../components/Footer";

// ── Partner logos from src/assets/logos/ ─────────────────────────
import logoBankAfrica      from "../../assets/logos/Bank-Of-Africa-BMCE-Group-Emploi-Recrutement-4.png";
import logoBanquePopulaire from "../../assets/logos/banque-centrale-populaire-du-maroc-central-popular-bank-of-morocco-148598.jpg";
import logoBanqueAtlantique from "../../assets/logos/BAQNQUE-ATLANTIQUE.png";
import logoNinova          from "../../assets/logos/clinic1.png";
import logoIsio            from "../../assets/logos/ISIO-Laboratoires-Emploi-Recrutement-1.png";
import logoAkdital         from "../../assets/logos/Logo-Akdital-FR-01.png";
import logoAttijari        from "../../assets/logos/LOGO-ATTIJARI-NEW.gif";
import logoOceanic         from "../../assets/logos/Logo-Oceanic-Clinic-whit-bg.jpg";
import logoSalonyy         from "../../assets/logos/Salonyy-logo.png";
import logoCliniqueTangier from "../../assets/logos/Tangier-ClinicofTangier-11.jpeg";
import logoVfs             from "../../assets/logos/VFS_Global_Logo.png";

const PARTNER_LOGOS = [
  { src: logoBankAfrica,       alt: "Bank of Africa BMCE" },
  { src: logoBanquePopulaire,  alt: "Banque Populaire" },
  { src: logoBanqueAtlantique, alt: "Banque Atlantique" },
  { src: logoNinova,           alt: "Ninova Clinic" },
  { src: logoIsio,             alt: "ISIO Laboratoires" },
  { src: logoAkdital,          alt: "Akdital" },
  { src: logoAttijari,         alt: "Attijari Bank" },
  { src: logoOceanic,          alt: "Oceanic Clinic El Hana" },
  { src: logoSalonyy,          alt: "Salonyy" },
  { src: logoCliniqueTangier,  alt: "Clinique Internationale Tanger" },
  { src: logoVfs,              alt: "VFS Global" },
];

// ── Infinite slider (no react-use-measure) ────────────────────────
function InfiniteSlider({ children, gap = 48, duration = 35 }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Wait one frame for the DOM to paint so scrollWidth is accurate
    const raf = requestAnimationFrame(() => {
      const fullWidth = el.scrollWidth;
      const half = fullWidth / 2;

      const controls = animate(x, [0, -half], {
        ease: "linear",
        duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => x.set(0),
      });

      // store stop fn for cleanup
      el._stopSlider = controls.stop;
    });

    return () => {
      cancelAnimationFrame(raf);
      trackRef.current?._stopSlider?.();
    };
  }, [duration, gap, x]);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex w-max"
        style={{ x, gap: `${gap}px` }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ── Logo cloud ────────────────────────────────────────────────────
function LogoCloud() {
  return (
    <div className="relative bg-white py-10 border-b border-slate-100">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />
      <div className="mb-5 text-center">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Trusted by leading businesses across Morocco
        </p>
      </div>
      <InfiniteSlider gap={64} duration={40}>
        {PARTNER_LOGOS.map((logo) => (
          <div
            key={logo.alt}
            className="flex h-24 w-52 shrink-0 items-center justify-center px-5 transition-all duration-300 hover:scale-105"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-16 w-auto max-w-[180px] object-contain"
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────
const CITY_OPTIONS = [
  { value: "Casablanca", label: "Casablanca" },
  { value: "Rabat", label: "Rabat" },
  { value: "Tangier", label: "Tangier" },
  
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "beauty_salon", label: "Beauty Salon" },
  { value: "clinic", label: "Clinic" },
  { value: "hospital", label: "Hospital" },
  { value: "bank", label: "Bank" },
  { value: "government_service", label: "Government Service" },
  { value: "embassy_consulate", label: "Embassy / Consulate" },
  { value: "medical_lab", label: "Medical Lab" },
  { value: "language_test_center", label: "Language Test Center" },
];

const SORT_OPTIONS = [
  { value: "Newest", label: "Newest first" },
  { value: "Highest Rated", label: "Highest rated" },
  { value: "Name A-Z", label: "Name A–Z" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

const ITEMS_PER_PAGE = 6;

// ── Custom dropdown ───────────────────────────────────────────────
function CustomSelect({ icon: Icon, placeholder, value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-12 w-full items-center gap-3 rounded-2xl border bg-white px-4 text-[13.5px] font-medium shadow-sm transition
          ${open ? "border-[#1f57d2] ring-[3px] ring-[#1f57d2]/10" : "border-slate-200 hover:border-slate-300"}`}
      >
        {Icon && <Icon size={16} strokeWidth={1.8} className="shrink-0 text-slate-400" />}
        <span className={`flex-1 truncate text-left ${selected ? "text-slate-800" : "text-slate-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={15} className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute left-0 right-0 top-full z-[101] mt-1.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
              <div className="max-h-[220px] overflow-y-auto p-1.5">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[13px] transition
                      ${value === opt.value ? "bg-blue-50 font-semibold text-[#1f57d2]" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {opt.label}
                    {value === opt.value && <Check size={13} className="text-[#1f57d2]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


function Stars({ rating = 0, size = 13, dark = false }) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size}
          className={i < Math.round(safe) ? "fill-amber-400 text-amber-400" : dark ? "text-slate-300" : "text-white/40"} />
      ))}
    </div>
  );
}

// ── Business Card ─────────────────────────────────────────────────
function BusinessCard({ business, index }) {
  const [favorite, setFavorite] = useState(false);
  const hasRealImage = business.mainPhoto || (Array.isArray(business.photos) && business.photos.length > 0);
  const image = hasRealImage ? (business.mainPhoto || business.photos[0]) : FALLBACK_IMAGE;

  const getCategoryLabel = (val) => {
    const found = CATEGORY_OPTIONS.find((c) => c.value === val);
    return found ? found.label : val || "Business";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(31,87,210,0.14)]"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={business.businessName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#132249] backdrop-blur-sm shadow-sm">
          {getCategoryLabel(business.category)}
        </div>
        <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm shadow-sm">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-800">{Number(business.rating || 0).toFixed(1)}</span>
        </div>

        <button type="button" onClick={() => setFavorite((v) => !v)}
          className={`absolute right-3.5 top-14 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm shadow transition-all duration-200
            ${favorite ? "bg-rose-500 text-white scale-110" : "bg-white/90 text-rose-400 hover:scale-110"}`}>
          <Heart size={15} className={favorite ? "fill-white" : "fill-rose-100"} />
        </button>

        <div className="absolute inset-x-3.5 bottom-3.5 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link to={`/business/${business._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[13px] font-semibold text-[#132249] shadow-lg transition hover:bg-[#f5f8ff]">
            <CalendarDays size={15} className="text-emerald-500" />Quick Book
          </Link>
        </div>

        <div className="absolute bottom-3.5 left-3.5 right-14 group-hover:opacity-0 transition-opacity duration-200">
          <h3 className="line-clamp-1 text-[17px] font-bold text-white leading-tight">{business.businessName}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={business.rating} />
            <span className="text-[11px] text-white/70">({business.reviewCount || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold text-slate-900 line-clamp-1">{business.businessName}</h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500 min-h-[38px]">
          {business.description || "No description available."}
        </p>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70">
          <div className="flex flex-col items-center py-2.5">
            <span className="text-[11px] text-slate-400">Rating</span>
            <div className="mt-0.5 flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[13px] font-bold text-slate-800">{Number(business.rating || 0).toFixed(1)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center py-2.5">
            <span className="text-[11px] text-slate-400">Staff</span>
            <div className="mt-0.5 flex items-center gap-1">
              <Users size={11} className="text-[#1f57d2]" />
              <span className="text-[13px] font-bold text-slate-800">{business.staffCount || business.queueCapacity || 1}</span>
            </div>
          </div>
          <div className="flex flex-col items-center py-2.5">
            <span className="text-[11px] text-slate-400">Wait</span>
            <div className="mt-0.5 flex items-center gap-1">
              <Clock3 size={11} className="text-emerald-500" />
              <span className="text-[13px] font-bold text-slate-800">{business.bookingInterval || 30}m</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
            <MapPin size={10} />{business.city || "—"}
          </span>
          {business.reviewCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">
              <TrendingUp size={10} />{business.reviewCount} reviews
            </span>
          )}
          {!hasRealImage && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-400">
              <ImageIcon size={10} />Sample photo
            </span>
          )}
        </div>

        {/* Address */}
        <div className="mt-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/40 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Address</p>
          <p className="mt-0.5 line-clamp-1 text-[12.5px] text-slate-700">{business.address || "Address not provided"}</p>
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => setFavorite((v) => !v)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition
              ${favorite ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"}`}>
            <Heart size={16} className={favorite ? "fill-current" : ""} />
          </button>
          <Link to={`/business/${business._id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1f57d2] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(31,87,210,0.3)] transition hover:bg-[#163fa8] hover:shadow-[0_6px_20px_rgba(31,87,210,0.4)]">
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


export default function Businesses() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedCity) {
      setBusinesses([]);
      setCurrentPage(1);
      setError("");
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/businesses?city=${encodeURIComponent(selectedCity)}`, {
          signal: controller.signal,
        });

        if (!cancelled) {
          setBusinesses(Array.isArray(res.data) ? res.data : []);
          setCurrentPage(1);
        }
      } catch (err) {
        if (cancelled || err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

        if (err?.response?.status === 429) {
          setError("Too many requests. Please wait a few seconds and try again.");
        } else {
          setError("Failed to load businesses.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCity]);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchTerm, sortBy]);

  const filtered = useMemo(() => {
    const f = businesses.filter((b) => {
      const matchCat = !selectedCategory || b.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q ||
        b.businessName?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    return [...f].sort((a, b) => {
      if (sortBy === "Highest Rated") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "Name A-Z") return (a.businessName || "").localeCompare(b.businessName || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [businesses, selectedCategory, searchTerm, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#f4f7ff]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover brightness-75">
          <source src={video1} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f5c]/90 via-[#1246b5]/70 to-[#1f57d2]/40" />
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#4a8cff]/20 blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight md:text-5xl">
              Find & book the best<br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                businesses near you
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/75">
              Nobty connects you with trusted local businesses. Browse by city, filter by category, and book your appointment in seconds.
            </p>
            <div className="mt-8 flex gap-8">
              {[["500+", "Businesses"], ["12k+", "Bookings"], ["4.8★", "Avg rating"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="text-[12px] text-white/50 font-medium">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[28px] bg-white/10 p-1.5 shadow-2xl backdrop-blur-md ring-1 ring-white/20"
          >
            <div className="rounded-[22px] bg-white p-6 text-[#132249] shadow-xl">
              <h2 className="text-[18px] font-bold text-slate-900">Search businesses</h2>
              <p className="mt-1 text-[12.5px] text-slate-400">Select a city, filter by category, or search by name.</p>
              <div className="mt-5 space-y-3">
                <CustomSelect icon={MapPin} placeholder="Choose a city" value={selectedCity} onChange={setSelectedCity} options={CITY_OPTIONS} label="City" />
                <CustomSelect icon={Building2} placeholder="All categories" value={selectedCategory} onChange={setSelectedCategory} options={CATEGORY_OPTIONS} label="Category" />
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Search</p>
                  <div className="relative">
                    <Search size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, address…"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13.5px] outline-none transition placeholder:text-slate-400 focus:border-[#1f57d2] focus:ring-[3px] focus:ring-[#1f57d2]/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGO CLOUD ── */}
      <LogoCloud />

      {/* ── RESULTS ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12.5px] font-medium text-slate-400">
                {!selectedCity
                  ? "Select a city to browse businesses"
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} in ${selectedCity}`}
              </p>
              <h2 className="mt-1 text-[28px] font-extrabold text-[#132249]">Explore Businesses</h2>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} className="text-slate-400" />
              <CustomSelect icon={SlidersHorizontal} placeholder="Sort by" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
            </div>
          </div>

          {/* Empty — no city selected */}
          {!selectedCity && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <MapPin size={28} className="text-[#1f57d2]" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-semibold text-slate-700">Select a city to get started</p>
              <p className="mt-1.5 text-[13px] text-slate-400">Choose a city from the search form above</p>
            </motion.div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[24px] bg-white shadow-sm animate-pulse">
                  <div className="h-52 bg-slate-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                    <div className="mt-4 h-10 rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] font-medium text-red-600">
              {error}
            </div>
          )}

          {/* No results */}
          {!loading && selectedCity && !error && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <Building2 size={28} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-semibold text-slate-700">No businesses found</p>
              <p className="mt-1.5 text-[13px] text-slate-400">Try adjusting your filters or search term</p>
            </motion.div>
          )}

          {/* Cards */}
          {!loading && paginated.length > 0 && (
            <>
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((business, i) => (
                  <BusinessCard key={business._id} business={business} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2">
                  <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#1f57d2] hover:text-[#1f57d2] disabled:cursor-not-allowed disabled:opacity-30">
                    <ChevronLeft size={16} />
                  </button>
                  {visiblePages.map((p) => (
                    <button key={p} onClick={() => handlePage(p)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-[13.5px] font-semibold transition shadow-sm
                        ${currentPage === p
                          ? "bg-[#1f57d2] text-white shadow-[0_4px_14px_rgba(31,87,210,0.35)]"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-[#1f57d2] hover:text-[#1f57d2]"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#1f57d2] hover:text-[#1f57d2] disabled:cursor-not-allowed disabled:opacity-30">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      
      <Footer />
    </div>
  );
}
