import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Mail, Phone, MapPin, User, Building2,
  MessageSquare, HeartHandshake, Send,
  Clock, CheckCircle, Sparkles,
} from "lucide-react";
import banner from "../../assets/contact.png";
import Footer from "../../components/Footer";

// ── Input field ───────────────────────────────────────────────────
function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0a4abf] focus:bg-white focus:ring-[3px] focus:ring-[#0a4abf]/10"
      />
    </div>
  );
}

// ── Morocco city markers displayed as cards ───────────────────────
const CITIES = [
  { city: "Casablanca", address: "Boulevard Mohammed V", phone: "+212 522 000 000", emoji: "🏙️" },
  { city: "Rabat", address: "Avenue Hassan II", phone: "+212 537 000 000", emoji: "🏛️" },
  { city: "Tangier", address: "Boulevard Mohammed VI", phone: "+212 539 000 000", emoji: "⚓" },
  { city: "Marrakech", address: "Avenue de la Ménara", phone: "+212 524 000 000", emoji: "🌴" },
  { city: "Fes", address: "Avenue Allal Al Fassi", phone: "+212 535 000 000", emoji: "🕌" },
];

// Map embed URLs for each city
const MAP_EMBEDS = {
  Casablanca: "https://maps.google.com/maps?q=casablanca+morocco&t=&z=13&ie=UTF8&iwloc=&output=embed",
  Rabat: "https://maps.google.com/maps?q=rabat+morocco&t=&z=13&ie=UTF8&iwloc=&output=embed",
  Tangier: "https://maps.google.com/maps?q=tangier+morocco&t=&z=13&ie=UTF8&iwloc=&output=embed",
  Marrakech: "https://maps.google.com/maps?q=marrakech+morocco&t=&z=13&ie=UTF8&iwloc=&output=embed",
  Fes: "https://maps.google.com/maps?q=fes+morocco&t=&z=13&ie=UTF8&iwloc=&output=embed",
};

export default function Contact() {
  const { t } = useTranslation();

  const [contactType, setContactType] = useState("customer");
  const [formData, setFormData] = useState({
    name: "", phone: "+212", email: "", subject: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeCity, setActiveCity] = useState("Casablanca");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !value.startsWith("+212")) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(""); setError("");
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError(t("contact.validation.required"));
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/contact", { ...formData, contactType });
      setSuccess(t("contact.validation.success"));
      setFormData({ name: "", phone: "+212", email: "", subject: "", message: "" });
      setContactType("customer");
    } catch (err) {
      setError(t("contact.validation.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#f4f7ff]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a1f5c]/90 via-[#1246b5]/75 to-[#0a4abf]/60" />
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#4a8cff]/20 blur-[100px]" />

        <div className="relative z-10 mx-auto flex min-h-[340px] max-w-7xl items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
           
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {t("contact.hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/80">
              {t("contact.hero.subtitle")}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm">
              {t("contact.hero.quote")}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="relative z-20 mx-auto -mt-8 max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(10,74,191,0.12)] ring-1 ring-slate-100"
        >
          {[
            { icon: Clock, label: "Response time", value: "< 2 hours" },
            { icon: CheckCircle, label: "Issues resolved", value: "98%" },
            { icon: HeartHandshake, label: "Happy clients", value: "100+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center border-r border-slate-100 py-5 last:border-0">
              <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Icon size={16} className="text-[#0a4abf]" strokeWidth={1.8} />
              </div>
              <p className="text-[18px] font-extrabold text-slate-900">{value}</p>
              <p className="text-[11px] font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── CONTACT CARD ── */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(10,74,191,0.1)] ring-1 ring-slate-100 md:grid md:grid-cols-2"
          >
            {/* LEFT — info panel */}
            <div className="bg-gradient-to-br from-[#0a4abf] via-[#1246b5] to-[#072d80] p-10 text-white">
              <h2 className="text-[26px] font-extrabold leading-tight">
                {t("contact.left.title")}
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-white/65">
                {t("contact.left.subtitle")}
              </p>

              <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <HeartHandshake size={18} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold">{t("contact.left.careTitle")}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/60">
                      {t("contact.left.careText")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {[
                  { icon: MapPin, title: t("contact.left.officeTitle"), lines: [t("contact.left.officeLine1"), t("contact.left.officeLine2")] },
                  { icon: Mail, title: t("contact.left.emailTitle"), lines: ["support@nobty.com", "contact@nobty.com"] },
                  { icon: Phone, title: t("contact.left.phoneTitle"), lines: [t("contact.left.phoneLine1"), t("contact.left.phoneLine2")] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold">{title}</h3>
                      {lines.map((l, i) => <p key={i} className="mt-0.5 text-[12px] text-white/60">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-1.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full bg-white/30 ${i === 0 ? "w-6" : "w-1.5"}`} />
                ))}
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="p-10">
              <h2 className="text-[20px] font-bold text-slate-900">Send us a message</h2>
              <p className="mt-1 text-[13px] text-slate-400">We'll get back to you within 2 hours.</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { value: "customer", label: t("contact.form.customer"), icon: User },
                  { value: "business", label: t("contact.form.business"), icon: Building2 },
                ].map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setContactType(value)}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-medium transition
                      ${contactType === value ? "border-[#0a4abf] bg-blue-50 text-[#0a4abf]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                    <Icon size={15} strokeWidth={1.8} />
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <Field icon={User} type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t("contact.form.name")} />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field icon={Phone} type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+212" />
                  <Field icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t("contact.form.email")} />
                </div>

                <Field icon={MessageSquare} type="text" name="subject" value={formData.subject} onChange={handleChange}
                  placeholder={contactType === "business" ? t("contact.form.businessSubject") : t("contact.form.subject")} />

                <div className="relative">
                  <MessageSquare size={16} strokeWidth={1.8} className="absolute left-4 top-3.5 text-slate-400" />
                  <textarea rows={5} name="message" value={formData.message} onChange={handleChange}
                    placeholder={contactType === "business" ? t("contact.form.businessMessage") : t("contact.form.message")}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 pt-3 pb-3 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0a4abf] focus:bg-white focus:ring-[3px] focus:ring-[#0a4abf]/10" />
                </div>

                {success && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-[13px] font-medium text-green-600">
                    <CheckCircle size={14} /> {success}
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-500">{error}</div>
                )}

                <motion.button
                  whileHover={{ y: -1, scale: 1.005 }}
                  whileTap={{ scale: 0.975 }}
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0a4abf] via-blue-500 to-cyan-400 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_rgba(10,74,191,0.25)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending…" : <>{t("contact.form.send")} <Send size={14} /></>}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAP SECTION ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 text-center">
              <p className="text-[11.5px] font-semibold uppercase tracking-widest text-slate-400">Find us</p>
              <h2 className="mt-1 text-[22px] font-extrabold text-slate-900">Our offices across Morocco</h2>
            </div>

            {/* City selector pills */}
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {CITIES.map((c) => (
                <button key={c.city} onClick={() => setActiveCity(c.city)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12.5px] font-medium transition
                    ${activeCity === c.city
                      ? "bg-[#0a4abf] text-white shadow-[0_4px_12px_rgba(10,74,191,0.3)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0a4abf] hover:text-[#0a4abf]"}`}>
                  <span>{c.emoji}</span>{c.city}
                </button>
              ))}
            </div>

            {/* Active city info bar */}
            {CITIES.filter((c) => c.city === activeCity).map((c) => (
              <div key={c.city} className="mb-4 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-100 bg-white px-6 py-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <MapPin size={14} className="text-[#0a4abf]" />
                  <span>{c.address}, {c.city}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <Phone size={14} className="text-[#0a4abf]" />
                  <span>{c.phone}</span>
                </div>
              </div>
            ))}

            {/* Map embed */}
            <div className="overflow-hidden rounded-[24px] shadow-[0_8px_32px_rgba(10,74,191,0.12)] ring-1 ring-slate-100">
              <iframe
                key={activeCity}
                title={`Nobty office in ${activeCity}`}
                src={MAP_EMBEDS[activeCity]}
                className="h-[460px] w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}