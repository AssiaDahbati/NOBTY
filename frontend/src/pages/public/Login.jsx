import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import axios from "axios";
import { useAuthModal } from "../../context/AuthModalContext";

import logo from "../../assets/NOBTY1.png";

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

export default function Login({ onClose }) {
  const { setAuthMode } = useAuthModal();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("rememberEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem("rememberEmail")));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 220);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("username", user.fullName || user.email);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      onClose?.();
      setTimeout(() => {
        window.location.href =
          user.role === "admin" ? "/admin"
          : user.role === "business_owner" ? "/dashboard"
          : "/";
      }, 50);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .login-wrap * { font-family: 'Inter', sans-serif; }

        .nobty-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          min-width: 16px;
          border: 1.5px solid #cbd5e1;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
          position: relative;
        }
        .nobty-checkbox:checked {
          background: #0a4abf;
          border-color: #0a4abf;
        }
        .nobty-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1.5px;
          width: 5px;
          height: 8px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .nobty-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(10,74,191,0.15);
        }
      `}</style>

      {/* Backdrop */}
      <motion.div
        className="login-wrap fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: closing ? 0 : 1, scale: closing ? 0.95 : 1, y: closing ? 16 : 0 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="relative w-full max-w-[400px] rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.15)]"
          style={{ overflow: "hidden" }}
        >
          {/* ── TOP SECTION: logo left, X right ── */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            {/* Logo — static, no animation */}
            <img
              src={logo}
              alt="Nobty"
              className="h-6 w-auto object-contain"
              draggable={false}
            />

            {/* X button — animated on click */}
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

          {/* ── BODY ── */}
          <div className="px-6 pb-6">
            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-[30px] font-semibold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="mt-0.5 text-[13px] text-slate-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-center text-[13px] font-medium text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-[3px] focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={1.8} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-[3px] focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex cursor-pointer select-none items-center gap-2 text-[12.5px] text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                    className="nobty-checkbox"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[12.5px] font-medium text-[#0a4abf] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In */}
              <motion.button
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.975 }}
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#0a4abf] via-blue-500 to-cyan-400 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.25)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in…" : "Sign In"}
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

              {/* Google */}
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Sign up */}
              <p className="pt-1 text-center text-[12.5px] text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className="font-medium text-[#0a4abf] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

