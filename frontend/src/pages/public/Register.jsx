import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  X,
  User,
  Briefcase,
  MapPin,
  Tag,
  ChevronDown,
  Check,
} from "lucide-react";
import axios from "axios";
import { useAuthModal } from "../../context/AuthModalContext";

import logo from "../../assets/NOBTY1.png";

// ── Google Icon ───────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.298 17.64 11.99 17.64 9.205Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

// ── Custom Select with scroll ─────────────────────────────────────
function CustomSelect({ icon: Icon, placeholder, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-slate-50 pl-10 pr-3 text-[13.5px] transition
          ${open ? "border-blue-300 bg-white ring-[3px] ring-blue-100" : "border-slate-200 hover:border-slate-300"}
          ${value ? "text-slate-800" : "text-slate-400"}`}
      >
        {Icon && (
          <Icon
            size={15}
            strokeWidth={1.8}
            className="absolute left-3.5 text-slate-400"
          />
        )}
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />

          {/* dropdown with scroll */}
          <div className="absolute left-0 right-0 top-full z-[101] mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="max-h-[180px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition
                    ${value === opt.value
                      ? "bg-blue-50 font-medium text-[#0a4abf]"
                      : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {opt.label}
                  {value === opt.value && (
                    <Check size={13} className="text-[#0a4abf]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Options ───────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "Beauty Salon", label: "Beauty Salon" },
  { value: "Clinic", label: "Clinic" },
  { value: "Spa", label: "Spa" },
  { value: "Bank", label: "Bank" },
  { value: "Embassy", label: "Embassy" },
  { value: "Government Service", label: "Government Service" },
  { value: "Language Center", label: "Language Center" },
];

const CITIES = [
  { value: "Casablanca", label: "Casablanca" },
  { value: "Rabat", label: "Rabat" },
  { value: "Tangier", label: "Tangier" },
  
];

// ── Main Component ────────────────────────────────────────────────
export default function Register({ onClose }) {
  const { setAuthMode } = useAuthModal();

  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+212");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  const isBusinessOwner = role === "business_owner";

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 220);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (isBusinessOwner && (!businessName || !category || !city)) {
      setError("Please complete all business information.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullName, email, phone, password, role, businessName, category, city,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("username", res.data.user.fullName || res.data.user.email);
      localStorage.setItem("userId", res.data.user.id);

      onClose?.();
      setTimeout(() => {
        window.location.href =
          res.data.user.role === "business_owner" ? "/complete-business-profile" : "/";
      }, 50);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-[3px] focus:ring-blue-100";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .reg-wrap * { font-family: 'Inter', sans-serif; }
        .reg-scroll::-webkit-scrollbar { width: 4px; }
        .reg-scroll::-webkit-scrollbar-track { background: transparent; }
        .reg-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .reg-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      {/* Backdrop */}
      <motion.div
        className="reg-wrap fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: closing ? 0 : 1, scale: closing ? 0.95 : 1, y: closing ? 16 : 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="my-8 w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.15)]"
        >
          {/* ── Top row: logo + X ── */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <img
              src={logo}
              alt="Nobty"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
            <motion.button
              onClick={handleClose}
              type="button"
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.8, rotate: 90 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              <X size={18} strokeWidth={2} />
            </motion.button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 pb-6">
            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="mt-0.5 text-[13px] text-slate-400">
                Join NOBTY as a customer or business owner
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-center text-[13px] font-medium text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Role selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition
                    ${role === "user"
                      ? "border-blue-200 bg-blue-50 text-[#0a4abf]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <User size={15} strokeWidth={1.8} />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("business_owner")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition
                    ${role === "business_owner"
                      ? "border-blue-200 bg-blue-50 text-[#0a4abf]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <Briefcase size={15} strokeWidth={1.8} />
                  Business Owner
                </button>
              </div>

              {/* Full name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                  <input
                    type="text"
                    placeholder="+212"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Business section */}
              {isBusinessOwner && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3"
                >
                  <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                    Business Information
                  </p>

                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                    <input
                      type="text"
                      placeholder="Business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`${inputClass} bg-white pl-10`}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <CustomSelect
                      icon={Tag}
                      placeholder="Select category"
                      value={category}
                      onChange={setCategory}
                      options={CATEGORIES}
                    />
                    <CustomSelect
                      icon={MapPin}
                      placeholder="Select city"
                      value={city}
                      onChange={setCity}
                      options={CITIES}
                    />
                  </div>
                </motion.div>
              )}

              {/* Create Account button */}
              <motion.button
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.975 }}
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#0a4abf] via-blue-500 to-cyan-400 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.25)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account…" : "Create Account"}
              </motion.button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-widest text-slate-300">
                    or
                  </span>
                </div>
              </div>

              {/* Google sign up */}
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Sign in link */}
              <p className="pt-1 text-center text-[12.5px] text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="font-medium text-[#0a4abf] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}