import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    setMessage("");
    setStatus("");

    if (!cleanEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setStatus("success");
      setMessage("Reset link sent successfully. Please check your inbox.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#f6f7f9] px-6 py-16">
      <div className="absolute left-[-140px] top-[-120px] h-80 w-80 rounded-full bg-[#1A52CC]/10 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-140px] h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
            <ShieldCheck size={14} className="text-[#1A52CC]" />
            Secure Recovery
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="border-b border-slate-100 px-8 py-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A52CC]/10 text-[#1A52CC]">
              <Mail size={26} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Forgot password?
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Enter your email address and we’ll send you a secure link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                    setStatus("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1A52CC] focus:bg-white focus:ring-4 focus:ring-[#1A52CC]/10"
                />
              </div>
            </div>

            {message && (
              <div
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                )}

                <span className="leading-6">{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A52CC] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(26,82,204,0.28)] transition hover:bg-[#1648B8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>

            <div className="flex justify-center pt-1">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#1A52CC]"
              >
                <ArrowLeft
                  size={16}
                  className="transition group-hover:-translate-x-1"
                />
                Back to login
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          For security, the reset link may expire after a short period.
        </p>
      </div>
    </section>
  );
}