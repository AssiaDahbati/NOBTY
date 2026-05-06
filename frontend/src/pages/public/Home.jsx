import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Search,
  MapPin,
  Star,
  Building2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Clock,
  ShieldCheck,
  LayoutDashboard,
  TrendingUp,
  Scissors,
  HeartPulse,
  Landmark,
  GraduationCap,
} from "lucide-react";

import api from "../../api/axios";
import Footer from "../../components/Footer";

import aboutHero from "../../assets/About.jpg";
import howServices from "../../assets/how_services.png";

import bankingImg from "../../assets/Banking Services.webp";
import educationImg from "../../assets/education.jpg";
import embassyImg from "../../assets/Embassy.png";
import governanceImg from "../../assets/governance.jpg";
import healthcareImg from "../../assets/Healthcare.webp";
import wellnessImg from "../../assets/wellness.avif";

import logoSalonyy from "../../assets/logos/Salonyy-logo.png";
import logoBankAfrica from "../../assets/logos/Bank-Of-Africa-BMCE-Group-Emploi-Recrutement-4.png";
import logoBanquePopulaire from "../../assets/logos/banque-centrale-populaire-du-maroc-central-popular-bank-of-morocco-148598.jpg";
import logoBanqueAtlantique from "../../assets/logos/BAQNQUE-ATLANTIQUE.png";
import logoNinova from "../../assets/logos/clinic1.png";
import logoIsio from "../../assets/logos/ISIO-Laboratoires-Emploi-Recrutement-1.png";
import logoAkdital from "../../assets/logos/Logo-Akdital-FR-01.png";
import logoAttijari from "../../assets/logos/LOGO-ATTIJARI-NEW.gif";
import logoOceanic from "../../assets/logos/Logo-Oceanic-Clinic-whit-bg.jpg";
import logoCliniqueTangier from "../../assets/logos/Tangier-ClinicofTangier-11.jpeg";
import logoVfs from "../../assets/logos/VFS_Global_Logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cityOptions = [
  { value: "", label: "Select city" },
  { value: "Tangier", label: "Tangier" },
  { value: "Rabat", label: "Rabat" },
  { value: "Casablanca", label: "Casablanca" },
];

const categoryOptions = [
  { value: "", label: "Select category" },
  { value: "beauty_salon", label: "Beauty Salon" },
  { value: "clinic", label: "Clinic" },
  { value: "spa", label: "Spa" },
  { value: "bank", label: "Bank" },
  { value: "embassy_consulate", label: "Embassy" },
  { value: "government_service", label: "Government Service" },
  { value: "language_test_center", label: "Language Center" },
];

function SoftSelect({ icon: Icon, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.value === value) || options[0];

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-xs text-slate-500 shadow-sm transition hover:border-[#0a4abf]/40"
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={14} className="shrink-0 text-[#0a4abf]" />}
          <span className="truncate">{selected.label}</span>
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
          >
            {options.map((item) => (
              <button
                key={item.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className={`block w-full rounded-xl px-3 py-2.5 text-left text-xs transition ${
                  value === item.value
                    ? "bg-[#0a4abf] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroSection() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  return (
    <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#f6f9ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,74,191,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_40%)]" />
      <div className="absolute left-[-80px] top-24 h-44 w-44 rounded-full bg-[#0a4abf]/10" />
      <div className="absolute right-[8%] top-[18%] h-7 w-7 rounded-full bg-[#0a4abf]/15" />
      <div className="absolute bottom-[12%] left-[45%] h-8 w-8 rounded-full bg-[#0a4abf]/20" />

      <div className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex-1">
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl"
          >
            We are{" "}
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(10,74,191,0.12)",
                  "0 0 0 8px rgba(10,74,191,0.04)",
                  "0 0 0 0 rgba(10,74,191,0.12)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="inline-block rounded-2xl border-2 border-dashed border-blue-400 px-3 italic text-[#0a4abf]"
            >
              simplifying
            </motion.span>
            <br />
            how services are booked.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            NOBTY helps people find trusted businesses, compare services, and reserve appointments
            with less effort and more confidence.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex max-w-[650px] flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_16px_45px_rgba(10,74,191,0.10)] md:flex-row"
          >
            <SoftSelect icon={MapPin} value={city} onChange={setCity} options={cityOptions} />
            <SoftSelect icon={Building2} value={category} onChange={setCategory} options={categoryOptions} />

            <div className="flex h-11 flex-[1.4] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs shadow-sm">
              <Search size={14} className="text-[#0a4abf]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search service"
                className="w-full bg-transparent text-slate-600 outline-none placeholder:text-slate-400"
              />
            </div>

            <Link
              to={`/businesses?city=${encodeURIComponent(city)}&category=${encodeURIComponent(
                category
              )}&search=${encodeURIComponent(query)}`}
              className="flex h-11 items-center justify-center rounded-xl bg-[#0a4abf] px-5 text-xs font-medium text-white transition hover:bg-[#083b9b]"
            >
              Search
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 45, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-[360px] w-[360px] items-end justify-center overflow-hidden rounded-full bg-[#0a4abf] shadow-[0_25px_70px_rgba(10,74,191,0.28)] md:h-[470px] md:w-[470px]"
          >
            <img src={aboutHero} alt="NOBTY professional" className="h-full w-full object-cover object-top" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const PARTNER_LOGOS = [
  { src: logoBankAfrica, alt: "Bank of Africa BMCE" },
  { src: logoBanquePopulaire, alt: "Banque Populaire" },
  { src: logoBanqueAtlantique, alt: "Banque Atlantique" },
  { src: logoNinova, alt: "Ninova Clinic" },
  { src: logoIsio, alt: "ISIO Laboratoires" },
  { src: logoAkdital, alt: "Akdital" },
  { src: logoAttijari, alt: "Attijari Bank" },
  { src: logoOceanic, alt: "Oceanic Clinic El Hana" },
  { src: logoSalonyy, alt: "Salonyy" },
  { src: logoCliniqueTangier, alt: "Clinique Internationale Tanger" },
  { src: logoVfs, alt: "VFS Global" },
];

function InfiniteSlider({ children, gap = 48, duration = 20 }) {
  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          animation: `slide ${duration}s linear infinite`,
        }}
      >
        {children}
        {children}
        {children}
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

function LogoCloud() {
  return (
    <div className="relative border-b border-slate-100 bg-white py-10">
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
            <img src={logo.src} alt={logo.alt} className="max-h-16 w-auto max-w-[180px] object-contain" />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

const categories = [
  {
    title: "Beauty",
    description: "Hair, beauty, grooming and salon appointments.",
    icon: Scissors,
    query: "beauty_salon",
    image: wellnessImg,
  },
  {
    title: "Clinic",
    description: "Consultations, doctors and healthcare bookings.",
    icon: HeartPulse,
    query: "clinic",
    image: healthcareImg,
  },
  {
    title: "Bank",
    description: "Banking appointments and financial services.",
    icon: Landmark,
    query: "bank",
    image: bankingImg,
  },
  {
    title: "Embassy",
    description: "Visa, consulate and document appointments.",
    icon: Building2,
    query: "embassy_consulate",
    image: embassyImg,
  },
  {
    title: "Government Service",
    description: "Administrative and public service appointments.",
    icon: Building2,
    query: "government_service",
    image: governanceImg,
  },
  {
    title: "Language Center",
    description: "Language tests, courses and education services.",
    icon: GraduationCap,
    query: "language_test_center",
    image: educationImg,
  },
];

function CategoriesSection() {
  const trackRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const CARD_WIDTH = 300;

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * CARD_WIDTH * 2, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden bg-[#f6f9ff] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4abf]">
              Discover Possibilities
            </p>

            <h2 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
              Explore Services <span className="text-[#0a4abf]">Without Limits</span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
              From beauty to banking, find the perfect service tailored to your needs in seconds.
            </p>

            <Link to="/businesses" className="group mt-4 flex items-center gap-1 text-sm font-medium text-slate-600 md:text-base">
              View all services
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="mt-6 flex shrink-0 items-center gap-2 md:mt-0">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0a4abf] shadow-sm transition hover:bg-[#0a4abf] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => scroll(1)}
              disabled={!canScrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0a4abf] shadow-sm transition hover:bg-[#0a4abf] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full pl-6 2xl:pl-[max(1.5rem,calc(50vw-672px))]">
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative h-[380px] w-[260px] shrink-0 cursor-pointer overflow-hidden rounded-[28px] shadow-md"
              >
                <Link to={`/businesses?category=${cat.query}`} className="block h-full w-full">
                  <img src={cat.image} alt={cat.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                      <Icon size={20} className="text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-white/70">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CATEGORY_TABS = [
  { value: "", label: "All" },
  { value: "beauty_salon", label: "Beauty" },
  { value: "clinic", label: "Clinic" },
  { value: "bank", label: "Bank" },
  { value: "embassy_consulate", label: "Embassy" },
  { value: "government_service", label: "Government" },
  { value: "language_test_center", label: "Language" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";

function ApiBusinessCard({ business, index }) {
  const image =
    business.mainPhoto ||
    (Array.isArray(business.photos) && business.photos[0]) ||
    FALLBACK_IMAGE;

  const rating = Number(business.rating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[200px] w-[300px] shrink-0 overflow-hidden rounded-[16px] shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <Link to={`/business/${business._id}`} className="block h-full w-full">
        <img src={image} alt={business.businessName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow backdrop-blur-sm">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-800">{rating.toFixed(1)}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-1 text-sm font-semibold text-white">{business.businessName}</h3>
          <div className="mt-1 flex items-center gap-1">
            <MapPin size={12} className="text-[#7eb3ff]" />
            <p className="line-clamp-1 text-xs text-white/70">{business.city}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ExploreBusiness() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const trackRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    api
      .get("/businesses", {
        params: { category: activeTab || undefined },
      })
      .then((res) => setBusinesses(res.data?.businesses ?? res.data ?? []))
      .catch(() => setBusinesses([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 270, behavior: "smooth" });
  };

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4abf]">
              Smart Discovery
            </p>

            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
              Find Trusted Businesses <span className="text-[#0a4abf]">Near You</span>
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Browse, compare, and book services from verified providers effortlessly.
            </p>
          </motion.div>

          <div className="flex items-end gap-3">
            <button
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0a4abf] shadow-md transition hover:bg-[#0a4abf] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0a4abf] shadow-md transition hover:bg-[#0a4abf] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                activeTab === tab.value
                  ? "bg-slate-950 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-[#0a4abf] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[200px] w-[300px] shrink-0 animate-pulse rounded-[16px] bg-slate-100" />
            ))
          ) : businesses.length === 0 ? (
            <div className="flex w-full items-center justify-center py-16 text-sm text-slate-400">
              No businesses found.
            </div>
          ) : (
            businesses.map((business, index) => (
              <ApiBusinessCard key={business._id} business={business} index={index} />
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/businesses"
            className="group flex items-center gap-2 rounded-full border border-[#0a4abf]/20 bg-[#f0f5ff] px-6 py-3 text-sm font-medium text-[#0a4abf] transition hover:bg-[#0a4abf] hover:text-white"
          >
            Browse all businesses
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const whyCards = [
  {
    title: "Save time",
    text: "Book services instantly without unnecessary calls, confusion, or long waiting.",
    icon: Clock,
  },
  {
    title: "Build trust",
    text: "Clear reviews and business details help users make confident, informed choices.",
    icon: ShieldCheck,
  },
  {
    title: "Support businesses",
    text: "Manage appointments, services, and customers all in one efficient platform.",
    icon: LayoutDashboard,
  },
  {
    title: "Grow faster",
    text: "Reach more clients and scale bookings with tools built for growth.",
    icon: TrendingUp,
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-white px-6 py-20 text-center">
      <div className="mx-auto mb-4 h-5 w-12 border-2 border-b-0 border-[#2563EB]" />

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-4xl font-semibold text-[#0a1628]"
      >
        Why NOBTY Stands Out
      </motion.h2>

      <p className="mt-2 text-sm text-[#6b7a99]">
        Designed to simplify life for users and empower businesses.
      </p>

      <div className="mx-auto mt-3 h-[2px] w-9 bg-[#2563EB]" />

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {whyCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col items-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#2563EB] text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white">
              <card.icon size={26} />
            </div>

            <h3 className="mt-4 text-[15px] font-semibold text-[#0a1628]">{card.title}</h3>

            <p className="mt-2 max-w-[150px] text-center text-xs leading-6 text-[#6b7a99]">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const testimonialsData = [
  {
    id: 1,
    text: "NOBTY helped us organize appointments better and cut waiting time for our clients. The platform is intuitive and saves us a lot of effort every day.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Yassine Alaoui",
    role: "Business Provider",
    company: "Salonyy Tanger",
    rating: 5,
  },
  {
    id: 2,
    text: "I booked my appointment in two minutes without calling or waiting. A fantastic and smooth experience — I highly recommend it.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Mariam Benali",
    role: "Client",
    company: "Tangier",
    rating: 5,
  },
  {
    id: 3,
    text: "NOBTY made it easy to find the right service, pick a convenient time, and confirm my booking in just a few simple steps.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Sara Idrissi",
    role: "Client",
    company: "Casablanca",
    rating: 5,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
    </div>
  );
}

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((c) => (c + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#f6f9ff] px-6 py-28">
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#0a4abf]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[-120px] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <motion.div
        initial="hidden"
        animate={controls}
        variants={stagger}
        className="relative mx-auto max-w-7xl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4abf]"
          >
            Real Experiences
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-5xl font-semibold tracking-tight text-slate-950"
          >
            What People <span className="text-[#0a4abf]">Love About Us</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            Trusted by clients and businesses across Morocco for faster bookings, smoother service,
            and better customer experiences.
          </motion.p>
        </div>

        {/* Minimal testimonial widget */}
        <motion.div variants={fadeUp} className="mx-auto mt-16 max-w-xl rounded-3xl bg-white px-8 py-10 shadow-[0_16px_60px_rgba(10,74,191,0.10)]">
          {/* Animated quote */}
          <div className="relative min-h-[100px] mb-10">
            {testimonialsData.map((t, i) => (
              <p
                key={t.id}
                className={`absolute inset-0 text-xl md:text-2xl font-light leading-relaxed text-slate-800 transition-all duration-500 ease-out ${
                  active === i
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm pointer-events-none"
                }`}
              >
                "{t.text}"
              </p>
            ))}
          </div>

          {/* Author row */}
          <div className="flex items-center gap-6">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {testimonialsData.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-white transition-all duration-300 ease-out ${
                    active === i ? "z-10 scale-110" : "grayscale hover:grayscale-0 hover:scale-105"
                  }`}
                >
                  <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Active author info */}
            <div className="relative min-h-[44px] flex-1">
              {testimonialsData.map((t, i) => (
                <div
                  key={t.id}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-300 ease-out ${
                    active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                  <span className="text-xs text-slate-500">
                    {t.role}{t.company ? ` · ${t.company}` : ""}
                  </span>
                </div>
              ))}
            </div>

            {/* Star rating */}
            <div className="shrink-0">
              <StarRating rating={testimonialsData[active].rating} />
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? "w-8 bg-[#0a4abf]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function useCounter(target, inView) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const step = target / 90;

    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [target, inView]);

  return count;
}

function WeBelieveSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  const appointments = useCounter(500, inView);
  const providers = useCounter(70, inView);
  const cities = useCounter(3, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mx-auto mb-4 h-5 w-12 border-2 border-b-0 border-[#2563EB]" />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4abf]"
        >
          Get Started
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950"
        >
          Your Time Deserves a <span className="text-[#0a4abf]">Smarter Way to Book</span>
        </motion.h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          NOBTY is designed to help users make faster decisions, book with clarity, and spend their
          time where it truly matters.
        </p>

        <div className="mx-auto mt-3 h-[2px] w-9 bg-[#2563EB]" />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img src={howServices} alt="NOBTY booking concept" className="w-full max-w-[420px] object-contain" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h3 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
              “We believe time should be invested, not spent waiting.”
            </h3>

            <div className="mt-10 grid grid-cols-3 gap-5">
              <div>
                <p className="text-3xl font-semibold text-[#0a4abf]">{appointments}+</p>
                <p className="mt-1 text-xs text-slate-500">Appointments</p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-[#0a4abf]">{providers}+</p>
                <p className="mt-1 text-xs text-slate-500">Providers</p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-[#0a4abf]">{cities}</p>
                <p className="mt-1 text-xs text-slate-500">Cities</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 lg:flex-row lg:items-start">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0a4abf] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.30)] transition hover:bg-[#083b9b] hover:shadow-[0_12px_32px_rgba(10,74,191,0.40)]"
              >
                Explore More
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-[#0a4abf]/20 bg-[#f0f5ff] px-7 py-3.5 text-sm font-semibold text-[#0a4abf] transition hover:bg-[#0a4abf] hover:text-white"
              >
                Join Us
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f8fbff] text-slate-900">
      <HeroSection />
      <LogoCloud />
      <CategoriesSection />
      <ExploreBusiness />
      <WhyChooseUs />
      <TestimonialsSection />
      <WeBelieveSection />
      <Footer />
    </div>
  );
}