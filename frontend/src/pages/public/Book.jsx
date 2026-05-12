/**
 * Book.jsx — Premium Service Booking
 * Palette  : Navy #1a2e6e · Warm white #FAFAF8 · Amber #D4962A · Slate text
 * Layout   : Full-height split panel (left = service hero, right = form)
 * Font     : "Plus Jakarta Sans" body, no extra imports needed via Tailwind
 * Motion   : framer-motion spring animations throughout
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  NotebookPen,
  Sparkles,
  ShieldCheck,
  Zap,
  RotateCcw,
  Check,
  Building2,
  MapPin,
  Timer,
  Banknote,
  Star,
  CalendarDays,
} from "lucide-react";
import api from "../../api/axios";

/* ─── palette tokens ─── */
const C = {
  navy:   "#1a2e6e",
  navyD:  "#111e4a",
  amber:  "#D4962A",
  amberL: "#FDF3DC",
  canvas: "#FAFAF8",
  panel:  "#F3F4F8",
  border: "#E4E7F0",
  muted:  "#8892AA",
  text:   "#1C2337",
};

/* ─── constants ─── */
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80";

const SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
];

/* ─── helpers ─── */
const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

const todayYMD = toYMD(new Date());

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return v;
  return d.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
}

function fmtShort(v) {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" });
}

function fmtPrice(p) { return `${Number(p||0).toLocaleString()} MAD`; }

function getWeek(anchor) {
  const base = new Date(anchor);
  const dow = base.getDay();
  base.setDate(base.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({length:6}, (_,i) => {
    const d = new Date(base); d.setDate(base.getDate()+i); return d;
  });
}

/* ─── micro components ─── */

function NavyDot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D4962A]" />;
}

/** Horizontal step strip */
function Steps({ step }) {
  const labels = ["Service Info", "Pick a Slot", "Confirmed"];
  return (
    <div
      style={{ background: C.canvas, borderBottom: `1px solid ${C.border}` }}
      className="flex items-center justify-center gap-0 px-6 py-3.5"
    >
      {labels.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                style={{
                  background: done ? "#16a34a" : active ? C.navy : C.border,
                  color: done || active ? "#fff" : C.muted,
                  boxShadow: active ? `0 0 0 4px ${C.navy}18` : "none",
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300"
              >
                {done ? <Check size={11} /> : n}
              </div>
              <span
                style={{ color: active ? C.navy : done ? "#16a34a" : C.muted }}
                className="hidden text-[13px] font-semibold sm:block"
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{ background: C.border }}
                className="mx-4 hidden h-px w-8 overflow-hidden sm:block"
              >
                <motion.div
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                  style={{ background: C.navy }}
                  className="h-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Animated week calendar */
function WeekPicker({ value, onChange }) {
  const [anchor, setAnchor] = useState(new Date());
  const week = getWeek(anchor);
  const month = anchor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const shift = (dir) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + dir * 7);
    setAnchor(d);
  };

  return (
    <div
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
      className="rounded-2xl p-4"
    >
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <p style={{ color: C.text }} className="text-sm font-bold capitalize">{month}</p>
        <div className="flex gap-1">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => shift(dir)}
              style={{ color: C.muted }}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-white hover:shadow-sm"
            >
              {dir === -1 ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-6 gap-2">
        {week.map((day) => {
          const ymd = toYMD(day);
          const sel = value === ymd;
          const past = ymd < todayYMD;
          const isToday = ymd === todayYMD;

          return (
            <div key={ymd} className="flex flex-col items-center gap-1.5">
              <span
                style={{ color: C.muted }}
                className="text-[10px] font-semibold uppercase tracking-wider"
              >
                {day.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 2)}
              </span>
              <button
                type="button"
                disabled={past}
                onClick={() => onChange(ymd)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
                style={{ color: sel ? "#fff" : past ? C.muted : C.text }}
              >
                <AnimatePresence>
                  {sel && (
                    <motion.div
                      layoutId="day-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: C.navy }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{day.getDate()}</span>
                {isToday && !sel && (
                  <span
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: C.amber }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Real-data-only star rating */
function Rating({ rating, count }) {
  if (!rating || !count) return null;
  return (
    <div
      style={{ background: C.amberL, color: C.amber }}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
    >
      <Star size={12} className="fill-current" />
      {Number(rating).toFixed(1)}
      <span style={{ color: "#B8882A" }} className="font-normal">({count})</span>
    </div>
  );
}

/** Skeleton shimmer */
function Skeleton() {
  return (
    <div style={{ background: C.canvas }} className="min-h-screen animate-pulse">
      <div className="h-14 bg-white shadow-sm" />
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <div style={{ background: C.panel }} className="h-10 w-28 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div style={{ background: C.panel }} className="h-96 rounded-3xl" />
          <div className="space-y-4">
            <div style={{ background: C.panel }} className="h-48 rounded-3xl" />
            <div style={{ background: C.panel }} className="h-40 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Book() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("");
  const [notes, setNotes]           = useState("");
  const [error, setError]           = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointment, setAppointment]       = useState(null);

  useEffect(() => {
    if (!serviceId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch {
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId]);

  const svc = useMemo(() => ({
    price:       service?.price        ?? 0,
    duration:    service?.duration     ?? 0,
    name:        service?.name         ?? "—",
    business:    service?.business?.businessName || service?.business?.name || "Business",
    businessId:  service?.business?._id || "",
    img:         service?.image        || FALLBACK_IMG,
    desc:        service?.description  || "No description available.",
    rating:      service?.rating       ?? null,
    reviews:     service?.reviewCount  ?? null,
    city:        service?.business?.city || service?.city || null,
  }), [service]);

  const step = useMemo(() => {
    if (bookingSuccess) return 3;
    if (date && time) return 2;
    return 1;
  }, [bookingSuccess, date, time]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    if (!date || !time)          { setError("Please select both a date and a time."); return; }
    if (!serviceId)              { setError("Missing service ID."); return; }
    if (!svc.businessId)         { setError("Missing business information."); return; }

    const token = localStorage.getItem("token");
    const safeParse = (v) => { try { return v ? JSON.parse(v) : null; } catch { return null; } };
    const stored =
      safeParse(localStorage.getItem("user")) ||
      safeParse(localStorage.getItem("authUser")) ||
      safeParse(localStorage.getItem("client")) ||
      safeParse(localStorage.getItem("currentUser"));
    const userId =
      localStorage.getItem("userId") || stored?._id || stored?.id || stored?.userId;

    if (!token || !userId) { setError("Session expired. Please log in again."); return; }

    try {
      setSubmitting(true);
      const res = await api.post(
        "/appointments",
        { userId, businessId: svc.businessId, serviceId, date, time, notes: notes.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data?.data || res.data;
      setAppointment({
        ...created,
        service: created?.service || service,
        date:    created?.date    || date,
        time:    created?.time    || time,
        notes:   created?.notes   || notes.trim(),
      });
      setBookingSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── States ── */
  if (loading) return <Skeleton />;

  if (error && !service && !bookingSuccess) {
    return (
      <div style={{ background: C.canvas }} className="flex min-h-screen items-center justify-center px-4">
        <div style={{ background:"#fff", border:`1px solid ${C.border}` }} className="w-full max-w-sm rounded-3xl p-8 text-center shadow-lg">
          <div style={{ background:"#FEF2F2" }} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl">⚠️</div>
          <h2 style={{ color: C.text }} className="text-lg font-bold">Something went wrong</h2>
          <p style={{ color: C.muted }} className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{ background: C.navy }}
            className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════
     CONFIRMATION
  ════════════════════════════════════════ */
  if (bookingSuccess && appointment) {
    return (
      <div style={{ background: C.canvas }} className="min-h-screen">
        <Steps step={3} />

        <div className="mx-auto max-w-5xl px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            style={{ color: C.navy, border: `1px solid ${C.border}`, background: "#fff" }}
            className="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Confirmation banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: C.navy }}
            className="mb-6 overflow-hidden rounded-3xl p-7 text-white shadow-2xl"
          >
            <div className="flex flex-wrap items-center gap-5">
              <div style={{ background: "rgba(255,255,255,0.12)" }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/20">
                <CheckCircle2 size={26} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ color: C.amber, background: `${C.amber}22` }} className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest">
                    Confirmed
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-black tracking-tight">Booking Confirmed!</h1>
                <p className="mt-0.5 text-sm text-white/70">Your appointment has been successfully created.</p>
              </div>
              {/* appointment ID chip */}
              <div style={{ background: "rgba(255,255,255,0.1)" }} className="hidden rounded-2xl px-4 py-3 sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Booking ID</p>
                <p className="mt-0.5 font-mono text-base font-bold text-white">
                  #{String(appointment._id).slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            {/* ── left: details + QR ── */}
            <div className="space-y-5">
              {/* details grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
                className="rounded-3xl p-6 shadow-sm"
              >
                <h2 style={{ color: C.text }} className="mb-4 text-base font-bold">Appointment Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Service",    val: appointment.service?.name || svc.name },
                    { label: "Business",   val: appointment.business?.businessName || svc.business },
                    { label: "Date",       val: fmtDate(appointment.date) },
                    { label: "Time",       val: appointment.time || "—" },
                    { label: "Status",     val: appointment.status || "Pending", green: true },
                    { label: "Booking ID", val: `#${String(appointment._id).slice(-6).toUpperCase()}`, mono: true },
                  ].map(({ label, val, green, mono }) => (
                    <div key={label} style={{ background: C.panel }} className="rounded-2xl p-3.5">
                      <p style={{ color: C.muted }} className="text-[10px] font-semibold uppercase tracking-widest">{label}</p>
                      <p style={{ color: green ? "#16a34a" : C.text }} className={`mt-1 break-words text-sm font-bold capitalize ${mono ? "font-mono" : ""}`}>
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {appointment.notes && (
                  <div style={{ background: C.panel, border: `1px solid ${C.border}` }} className="mt-3 rounded-2xl p-3.5">
                    <p style={{ color: C.muted }} className="text-[10px] font-semibold uppercase tracking-widest">Your Note</p>
                    <p style={{ color: C.text }} className="mt-1 text-sm">{appointment.notes}</p>
                  </div>
                )}
              </motion.div>

              {/* QR */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
                className="rounded-3xl p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div style={{ background: `${C.navy}0F` }} className="flex h-9 w-9 items-center justify-center rounded-xl">
                    <Sparkles size={16} style={{ color: C.navy }} />
                  </div>
                  <div>
                    <h3 style={{ color: C.text }} className="text-sm font-bold">Check-in QR Code</h3>
                    <p style={{ color: C.muted }} className="text-xs">Show at the venue for instant verification</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div style={{ border: `2px solid ${C.border}` }} className="inline-block rounded-2xl bg-white p-4 shadow-sm">
                    <QRCode
                      size={140}
                      value={JSON.stringify({
                        id: appointment._id,
                        service: appointment.service?.name || svc.name,
                        business: appointment.business?.businessName || svc.business,
                        date: appointment.date,
                        time: appointment.time,
                        status: appointment.status || "pending",
                      })}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── right: summary + actions ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <div style={{ background: "#fff", border: `1px solid ${C.border}` }} className="rounded-3xl p-5 shadow-sm">
                <h3 style={{ color: C.text }} className="mb-4 text-base font-bold">Reservation Summary</h3>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <img src={svc.img} alt={svc.name} className="h-28 w-full object-cover" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    { l: "Service",  v: svc.name },
                    { l: "Business", v: svc.business },
                    { l: "Duration", v: `${svc.duration} min` },
                    { l: "Date",     v: fmtDate(appointment.date) },
                    { l: "Time",     v: appointment.time || "—" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between text-sm">
                      <span style={{ color: C.muted }}>{l}</span>
                      <span style={{ color: C.text }} className="max-w-[55%] truncate text-right font-semibold capitalize">{v}</span>
                    </div>
                  ))}
                  <div style={{ borderColor: C.border }} className="my-1 border-t border-dashed" />
                  <div className="flex justify-between text-sm font-bold">
                    <span style={{ color: C.text }}>Total Paid</span>
                    <span style={{ color: C.amber }}>{fmtPrice(svc.price)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/account/appointments")}
                style={{ background: C.navy }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
              >
                View My Appointments <ChevronRight size={15} />
              </button>
              <button
                onClick={() => navigate("/businesses")}
                style={{ border: `1px solid ${C.border}`, color: C.text }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold transition hover:bg-slate-50"
              >
                Explore More Services
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════
     BOOKING FORM — split panel
  ════════════════════════════════════════ */
  return (
    <div style={{ background: C.canvas }} className="min-h-screen">
      <Steps step={step} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* back */}
        <button
          onClick={() => navigate(-1)}
          style={{ color: C.navy, border: `1px solid ${C.border}`, background: "#fff" }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] items-start">

          {/* ══════════ LEFT — service hero panel ══════════ */}
          <div className="lg:sticky lg:top-6 space-y-4">

            {/* hero image card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ border: `1px solid ${C.border}` }}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              {/* image */}
              <div className="relative">
                <img
                  src={svc.img}
                  alt={svc.name}
                  className="h-52 w-full object-cover"
                />
                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* verified badge */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-emerald-700 backdrop-blur-sm">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>

                {/* price pill — bottom right of image */}
                <div
                  style={{ background: C.amber }}
                  className="absolute bottom-4 right-4 rounded-2xl px-3.5 py-2 text-right shadow-lg"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">Price</p>
                  <p className="text-base font-black text-white leading-tight">{fmtPrice(svc.price)}</p>
                </div>

                {/* title on image */}
                <div className="absolute bottom-4 left-4 right-24">
                  <h1 className="text-xl font-black leading-tight text-white drop-shadow-lg">
                    {svc.name}
                  </h1>
                  {svc.city && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
                      <MapPin size={10} /> {svc.city}
                    </p>
                  )}
                </div>
              </div>

              {/* body */}
              <div className="p-5">
                {/* business + rating row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div style={{ background: `${C.navy}0F` }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <Building2 size={14} style={{ color: C.navy }} />
                    </div>
                    <div>
                      <p style={{ color: C.muted }} className="text-[10px] font-semibold uppercase tracking-widest">Business</p>
                      <p style={{ color: C.text }} className="text-sm font-bold leading-tight">{svc.business}</p>
                    </div>
                  </div>
                  <Rating rating={svc.rating} count={svc.reviews} />
                </div>

                {/* description */}
                <p style={{ color: C.muted }} className="mt-4 text-sm leading-6 line-clamp-3">
                  {svc.desc}
                </p>

                {/* stats row */}
                <div style={{ borderTop: `1px solid ${C.border}` }} className="mt-5 flex gap-5 pt-4">
                  {[
                    { icon: Timer,   label: "Duration", value: `${svc.duration} min` },
                    { icon: CalendarDays, label: "Booking type", value: "Appointment" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div style={{ background: `${C.navy}0F` }} className="flex h-8 w-8 items-center justify-center rounded-lg">
                        <Icon size={14} style={{ color: C.navy }} />
                      </div>
                      <div>
                        <p style={{ color: C.muted }} className="text-[10px] font-semibold uppercase tracking-widest">{label}</p>
                        <p style={{ color: C.text }} className="text-sm font-bold">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* trust card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ border: `1px solid ${C.border}` }}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, text: "Payments are secure & encrypted",   cls: "bg-emerald-50 text-emerald-600" },
                  { icon: Zap,         text: "Instant booking confirmation",       cls: "bg-blue-50 text-blue-600" },
                  { icon: RotateCcw,   text: "Free cancellation available",        cls: "bg-violet-50 text-violet-600" },
                ].map(({ icon: Icon, text, cls }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${cls}`}>
                      <Icon size={14} />
                    </div>
                    <span style={{ color: C.text }} className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ══════════ RIGHT — booking form ══════════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ border: `1px solid ${C.border}` }}
            className="rounded-3xl bg-white shadow-sm"
          >
            {/* form header */}
            <div
              style={{ borderBottom: `1px solid ${C.border}` }}
              className="flex items-center gap-3 px-6 py-5"
            >
              <div style={{ background: C.navy }} className="flex h-9 w-9 items-center justify-center rounded-xl">
                <CalendarDays size={16} className="text-white" />
              </div>
              <div>
                <h2 style={{ color: C.text }} className="text-base font-black">Schedule Your Appointment</h2>
                <p style={{ color: C.muted }} className="text-xs">Select your preferred date and time below</p>
              </div>
            </div>

            <form onSubmit={handleBook} className="p-6 space-y-7">

              {/* ── DATE ── */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NavyDot />
                    <h3 style={{ color: C.text }} className="text-sm font-bold">Choose a Date</h3>
                  </div>
                  {date && (
                    <span
                      style={{ background: `${C.navy}0F`, color: C.navy }}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {fmtShort(date)}
                    </span>
                  )}
                </div>
                <WeekPicker value={date} onChange={setDate} />
              </div>

              {/* ── TIME ── */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NavyDot />
                    <h3 style={{ color: C.text }} className="text-sm font-bold">Choose a Time</h3>
                  </div>
                  {time && (
                    <span
                      style={{ background: `${C.navy}0F`, color: C.navy }}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {time}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                  {SLOTS.map((slot) => {
                    const sel = time === slot;
                    return (
                      <div key={slot} className="relative">
                        <button
                          type="button"
                          onClick={() => setTime(slot)}
                          style={{
                            border: sel ? `1.5px solid ${C.navy}` : `1.5px solid ${C.border}`,
                            color: sel ? "#fff" : C.text,
                            background: sel ? "transparent" : C.panel,
                          }}
                          className="relative flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-150"
                        >
                          <AnimatePresence>
                            {sel && (
                              <motion.div
                                layoutId="slot-bg"
                                className="absolute inset-0 rounded-xl"
                                style={{ background: C.navy }}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                          </AnimatePresence>
                          <Clock size={11} className="relative z-10 shrink-0" />
                          <span className="relative z-10">{slot}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── NOTES ── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <NavyDot />
                  <h3 style={{ color: C.text }} className="text-sm font-bold">
                    Notes <span style={{ color: C.muted }} className="font-normal">(optional)</span>
                  </h3>
                </div>
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any special requests for the business…"
                    style={{ border: `1.5px solid ${C.border}`, background: C.panel, color: C.text }}
                    className="w-full resize-none rounded-2xl px-4 py-3 pr-11 text-sm placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#1a2e6e]/10"
                    onFocus={(e) => (e.target.style.borderColor = C.navy)}
                    onBlur={(e) => (e.target.style.borderColor = C.border)}
                  />
                  <NotebookPen size={15} style={{ color: C.muted }} className="pointer-events-none absolute right-4 top-3.5" />
                </div>
              </div>

              {/* ── SUMMARY INLINE ── */}
              {(date || time) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{ background: `${C.navy}06`, border: `1.5px solid ${C.navy}18` }}
                  className="overflow-hidden rounded-2xl px-4 py-4"
                >
                  <p style={{ color: C.navy }} className="mb-3 text-xs font-bold uppercase tracking-widest">Booking Preview</p>
                  <div className="space-y-2">
                    {[
                      { l: "Service",  v: svc.name },
                      { l: "Date",     v: date ? fmtDate(date) : "—" },
                      { l: "Time",     v: time || "—" },
                      { l: "Duration", v: `${svc.duration} min` },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between text-sm">
                        <span style={{ color: C.muted }}>{l}</span>
                        <span style={{ color: C.text }} className="font-semibold capitalize">{v}</span>
                      </div>
                    ))}
                    <div style={{ borderColor: C.border }} className="my-1 border-t border-dashed pt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span style={{ color: C.text }}>Total</span>
                        <span style={{ color: C.amber }}>{fmtPrice(svc.price)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ERROR ── */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* ── SUBMIT ── */}
              <button
                type="submit"
                disabled={submitting || !date || !time}
                style={{ background: C.navy }}
                className="relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {/* amber shimmer line on top */}
                <span
                  style={{ background: C.amber }}
                  className="absolute inset-x-0 top-0 h-0.5 opacity-60"
                />
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Confirming…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Confirm Booking
                    <ChevronRight size={16} />
                  </span>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}