import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Users,
  ShieldCheck,
  Clock3,
  ChevronDown,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import targetImg from "../../assets/about-business.jpg";

// ── Uploaded hero images (place in src/assets/)
import pic000 from "../../assets/pic000.png";
import pic1   from "../../assets/pic1.png";
import pic2   from "../../assets/pic2.png";
import pic4   from "../../assets/pic4.png";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ---------------------------------------------------------------------------
// Section Label — reusable pill-style heading accent
// ---------------------------------------------------------------------------
function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#0a4abf]/20 bg-[#f0f5ff] px-4 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#0a4abf]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0a4abf]">
        {children}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rotating words
// ---------------------------------------------------------------------------
const rotatingWords = ["faster", "smarter", "simpler", "easier", "better"];

// Hero images for slideshow
const HERO_IMAGES = [pic000, pic1, pic2, pic4];

// ---------------------------------------------------------------------------
// About Hero — with animated image slideshow
// ---------------------------------------------------------------------------
function AboutHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  // Rotate words
  useEffect(() => {
    const id = setTimeout(
      () => setWordIndex((p) => (p + 1) % rotatingWords.length),
      2200
    );
    return () => clearTimeout(id);
  }, [wordIndex]);

  // Rotate images with a longer interval
  useEffect(() => {
    const id = setInterval(
      () => setImgIndex((p) => (p + 1) % HERO_IMAGES.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#f6f9ff]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,74,191,0.13),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_42%)]" />
      <div className="absolute left-[-100px] top-20 h-52 w-52 rounded-full bg-[#0a4abf]/10 blur-3xl" />
      <div className="absolute right-[5%] bottom-[10%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl flex-col items-center gap-14 px-6 py-20 lg:flex-row">

        {/* ── LEFT TEXT ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-2xl"
        >
       

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl font-bold leading-[1.12] tracking-tight text-slate-950 md:text-[3.6rem]"
          >
            Booking made{" "}
            {/* Fixed-width container so other words don't shift layout */}
            <span className="relative inline-block">
              <span className="invisible font-bold text-[#0a4abf]">smarter</span>
              <span className="absolute inset-0 flex items-center justify-start overflow-hidden">
                {rotatingWords.map((word, i) => (
                  <motion.span
                    key={word}
                    className="absolute font-bold text-[#0a4abf]"
                    initial={{ opacity: 0, y: 36 }}
                    animate={
                      i === wordIndex
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: i < wordIndex ? -36 : 36 }
                    }
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </span>
            {" "}for everyone.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg font-normal leading-8 text-slate-600"
          >
            NOBTY is a modern booking platform designed to make appointment
            scheduling easier, faster, and more organized for both clients and
            service providers.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-7 text-slate-500"
          >
            We help users discover trusted businesses, compare services, and
            reserve appointments online with confidence. At the same time, we
            support businesses with tools to manage bookings, services,
            availability, and customer interactions.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a4abf] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.30)] transition hover:bg-[#0839a0] hover:shadow-[0_12px_32px_rgba(10,74,191,0.40)]"
            >
              Explore Businesses
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#0a4abf] hover:text-[#0a4abf]"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-8">
            {[
              { icon: CalendarCheck, value: "500+", label: "Appointments booked" },
              { icon: Users, value: "70+", label: "Businesses listed" },
              { icon: MapPin, value: "3", label: "Cities in Morocco" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a4abf]/10 text-[#0a4abf]">
                  <Icon size={19} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-950">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT IMAGE SLIDESHOW ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex shrink-0 items-center justify-center"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-8 rounded-[40px] bg-[#0a4abf] opacity-[0.07] blur-3xl" />

            {/* Image frame */}
            <div className="relative h-[520px] w-[370px] overflow-hidden rounded-[36px] bg-gradient-to-br from-[#e8f0ff] to-white shadow-[0_28px_70px_rgba(10,74,191,0.18)] md:w-[430px]">
              <AnimatePresence mode="sync">
                <motion.img
                  key={imgIndex}
                  src={HERO_IMAGES[imgIndex]}
                  alt="NOBTY user"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Image dots indicator */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === imgIndex
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating badge — top left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
              className="absolute -left-10 top-10 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-[0_8px_28px_rgba(10,74,191,0.14)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0a4abf]">
                <CalendarCheck size={15} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-900">Appointment booked</p>
                <p className="text-[10px] text-slate-400">Just now · Casablanca</p>
              </div>
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 120 }}
              className="absolute -right-10 bottom-14 flex items-center gap-2.5 rounded-2xl bg-[#0a4abf] px-4 py-2.5 shadow-[0_8px_28px_rgba(10,74,191,0.35)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white">
                <Users size={15} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white">70+ Businesses</p>
                <p className="text-[10px] text-blue-200">Across Morocco</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About Intro — Problem & Solution
// ---------------------------------------------------------------------------
function AboutIntro() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-14 text-center">
          <SectionLabel>Why we exist</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            A real problem. A real solution.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            We noticed a gap between how services are offered and how people actually book them.
            NOBTY was built to close that gap.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group rounded-[32px] bg-[#f6f9ff] p-9 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition group-hover:scale-105">
              <Clock3 size={26} />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">The Problem</p>
            <h3 className="text-2xl font-bold text-slate-950">The friction we noticed</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Booking a service is still difficult for many customers. People often waste time
              searching, calling to ask about availability, waiting without clear information,
              or choosing a business without knowing its quality.
            </p>
            <ul className="mt-5 space-y-2">
              {["No centralized place to discover services", "Phone calls just to check availability", "Unclear pricing and wait times"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-slate-500">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-100 text-red-400 flex items-center justify-center text-[9px] font-bold">✕</span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group rounded-[32px] bg-[#0a4abf] p-9 text-white shadow-[0_24px_60px_rgba(10,74,191,0.22)] transition hover:shadow-[0_30px_70px_rgba(10,74,191,0.30)]"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:scale-105">
              <CalendarCheck size={26} />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">The Solution</p>
            <h3 className="text-2xl font-bold">What we built</h3>
            <p className="mt-4 text-base leading-8 text-blue-50">
              NOBTY brings businesses and customers into one simple platform. Users can explore
              services, check business information, book appointments, and manage their time
              through a clear digital experience.
            </p>
            <ul className="mt-5 space-y-2">
              {["Browse & compare businesses in seconds", "Book appointments with one tap", "Businesses manage everything in one place"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-blue-100">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan-300" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Vision Section
// ---------------------------------------------------------------------------
function VisionSection() {
  return (
    <section className="bg-[#f6f9ff] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <SectionLabel>Our Vision</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Building a smarter way to connect<br className="hidden md:block" /> services and people.
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-[#0a4abf]/30" />
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-[#0a4abf]/8 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] shadow-[0_25px_60px_rgba(10,74,191,0.15)]">
                <img
                  src={targetImg}
                  alt="NOBTY vision"
                  className="w-[420px] object-cover md:w-[500px]"
                />
              </div>
              {/* Floating badge on image */}
              <div className="absolute -bottom-5 -right-5 rounded-2xl bg-white px-5 py-3 shadow-[0_12px_36px_rgba(10,74,191,0.15)]">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#0a4abf]" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Growing fast</p>
                    <p className="text-[10px] text-slate-400">3 cities & counting</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <p className="text-base leading-7 text-slate-500">
              Our vision is to become a trusted digital booking platform that connects people
              with reliable service providers across Morocco.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500">
              We aim to create a smoother experience where finding, comparing, and booking
              services becomes simple, transparent, and accessible for everyone.
            </p>

            {/* Vision pillars */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "Transparency", text: "Clear info before every booking" },
                { icon: Sparkles,    title: "Simplicity",   text: "One platform, zero confusion" },
                { icon: TrendingUp,  title: "Growth",       text: "Expanding city by city" },
                { icon: Users,       title: "Community",    text: "Built for Morocco's people" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a4abf]/10 text-[#0a4abf]">
                    <Icon size={17} />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Map Section
// ---------------------------------------------------------------------------
const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const moroccoCities = [
  { name: "Casablanca", position: [33.5731, -7.5898], description: "A key business and service hub for NOBTY." },
  { name: "Rabat",      position: [34.0209, -6.8416], description: "Supporting organized appointments in the capital." },
  { name: "Tangier",    position: [35.7595, -5.834],  description: "Expanding booking access in northern Morocco." },
];

function VisionMapSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <SectionLabel>Where we operate</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Growing across Morocco
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            NOBTY currently operates in Casablanca, Rabat, and Tangier — with more cities
            coming soon as we continue to grow.
          </p>
        </motion.div>

        {/* City cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {moroccoCities.map((city, i) => (
            <motion.div
              key={city.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl bg-[#f6f9ff] px-5 py-4 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a4abf]/10 text-[#0a4abf]">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{city.name}</p>
                <p className="text-xs text-slate-400">{city.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-[32px] bg-[#f6f9ff] p-3 shadow-[0_20px_55px_rgba(10,74,191,0.10)]"
        >
          <div className="h-[440px] overflow-hidden rounded-[26px]">
            <MapContainer center={[32.5, -6.5]} zoom={6} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {moroccoCities.map((city) => (
                <Marker key={city.name} position={city.position} icon={customMarker}>
                  <Popup>
                    <strong>{city.name}</strong><br />{city.description}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mission Section
// ---------------------------------------------------------------------------
function MissionSection() {
  return (
    <section className="bg-[#f6f9ff] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <SectionLabel>Our Mission</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Reducing waiting time,<br className="hidden md:block" /> simplifying appointments.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Three core principles guide everything we build at NOBTY.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock3,
              title: "Save time",
              text: "Help clients book services without unnecessary calls, confusion, or long waiting.",
              color: "text-emerald-500",
              bg: "bg-emerald-50",
              num: "01",
            },
            {
              icon: ShieldCheck,
              title: "Build trust",
              text: "Give users clear business details, reviews, and service information before booking.",
              color: "text-[#0a4abf]",
              bg: "bg-blue-50",
              num: "02",
            },
            {
              icon: Building2,
              title: "Support businesses",
              text: "Help service providers manage appointments, availability, and customers professionally.",
              color: "text-violet-500",
              bg: "bg-violet-50",
              num: "03",
            },
          ].map(({ icon: Icon, title, text, color, bg, num }, index) => (
            <motion.div
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Number watermark */}
              <span className="absolute right-6 top-5 text-6xl font-black text-slate-50 select-none">
                {num}
              </span>
              <div className={`relative mb-5 flex h-13 w-13 items-center justify-center rounded-2xl ${bg} ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="relative text-xl font-bold text-slate-950">{title}</h3>
              <p className="relative mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Dot pattern
// ---------------------------------------------------------------------------
function DotPattern({ className }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-[#0a4abf]/[0.07] ${className ?? ""}`}
    >
      <defs>
        <pattern id={id} width={6} height={6} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={0.85} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quote CTA Section
// ---------------------------------------------------------------------------
function QuoteCTASection() {
  const stats = [
    { icon: Building2,     value: "70+",  label: "Businesses" },
    { icon: CalendarCheck, value: "500+", label: "Appointments" },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <SectionLabel>Start today</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Ready to book smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
            Join thousands of users and businesses already saving time with NOBTY.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          {/* Left — dotted CTA card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative flex-1 overflow-hidden rounded-[32px] border border-[#0a4abf]/20 bg-white p-10 shadow-sm"
          >
            <DotPattern />
            <div className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 rounded-sm bg-[#0a4abf]" />
            <div className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 rounded-sm bg-[#0a4abf]" />
            <div className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-sm bg-[#0a4abf]" />
            <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 rounded-sm bg-[#0a4abf]" />

            <div className="relative z-10">
              <div className="text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl lg:text-[3.2rem]">
                <div className="flex flex-wrap gap-x-3">
                  <h2 className="font-bold">Start booking</h2>
                  <p className="font-normal">smarter</p>
                </div>
                <div className="flex flex-wrap gap-x-3">
                  <p className="font-normal">with</p>
                  <h2 className="font-bold text-[#0a4abf]">NOBTY.</h2>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
                Discover trusted businesses, explore available services, and reserve your next
                appointment through a platform built around time, trust, and convenience.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0a4abf]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-950">{value}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/businesses"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a4abf] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.22)] transition hover:bg-[#0839a0]"
                >
                  Explore Businesses
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#0a4abf] hover:text-[#0a4abf]"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right — blue belief card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="flex flex-col justify-between overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a4abf] to-[#1a6adf] p-10 text-white shadow-[0_24px_60px_rgba(10,74,191,0.22)] lg:w-[340px] lg:shrink-0"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                Our belief
              </p>
              <p className="mt-4 text-2xl font-bold leading-snug tracking-tight md:text-3xl">
                "We believe time should be invested, not spent waiting."
              </p>
              <p className="mt-5 text-sm leading-7 text-blue-100">
                NOBTY helps users make faster decisions, book with clarity, and spend their
                time where it truly matters.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      <Icon size={17} className="text-white" />
                    </div>
                    <p className="text-sm text-blue-100">{label}</p>
                  </div>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ Section
// ---------------------------------------------------------------------------
const faqs = [
  {
    question: "What is NOBTY?",
    answer: "NOBTY is a booking platform that helps clients discover businesses, compare services, and reserve appointments online.",
  },
  {
    question: "Who can use NOBTY?",
    answer: "NOBTY is built for both clients who want to book services and businesses that want to manage appointments more professionally.",
  },
  {
    question: "Can businesses manage their services on NOBTY?",
    answer: "Yes. Business providers can manage their profile, services, availability, bookings, and customer interactions from their dashboard.",
  },
  {
    question: "Which cities does NOBTY focus on?",
    answer: "NOBTY currently focuses on Casablanca, Rabat, and Tangier, with plans to expand to more cities in Morocco.",
  },
];

function AboutFAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#f6f9ff] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Questions about NOBTY?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
            Here are the most important answers about how NOBTY helps users and service providers.
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`cursor-pointer border-b border-slate-100 px-8 py-6 last:border-b-0 transition hover:bg-[#f8faff] ${
                openIndex === index ? "bg-[#f6f9ff]" : ""
              }`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-slate-950">{faq.question}</h3>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  openIndex === index ? "bg-[#0a4abf] text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-400 ease-in-out ${
                openIndex === index ? "max-h-[200px] pt-3 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <p className="text-sm leading-7 text-slate-500">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function About() {
  return (
    <div className="min-h-screen bg-[#f6f9ff] text-slate-900">
      <Navbar />
      <AboutHero />
      <AboutIntro />
      <VisionSection />
      <VisionMapSection />
      <MissionSection />
      <QuoteCTASection />
      <AboutFAQSection />
      <Footer />
    </div>
  );
}