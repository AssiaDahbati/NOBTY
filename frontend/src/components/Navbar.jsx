import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LayoutDashboard,
  MessageSquare,
  Home,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";

import logo from "../assets/NOBTY.png";
import ukFlag from "../assets/uk.flag.png";
import frFlag from "../assets/france.flag.png";
import saFlag from "../assets/saudi.icon.png";

import { getUnreadReplyCount } from "../services/userMessageService";
import NotificationDropdown from "./NotificationDropdown";
import { useAuthModal } from "../context/AuthModalContext";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin, openRegister } = useAuthModal();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const langRef = useRef(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("userRole");
  const firstLetter = username.charAt(0).toUpperCase();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLangOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("businessId");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setFloatingMenuOpen(false);
    navigate("/");
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchUnreadCount = async () => {
      if (!token || userRole === "admin" || userRole === "business_owner") {
        if (!cancelled) setUnreadCount(0);
        return;
      }

      try {
        const data = await getUnreadReplyCount();
        if (!cancelled) setUnreadCount(data?.count || 0);
      } catch (error) {
        // 429 happens when requests are repeated too fast. Keep UI calm.
        if (error?.response?.status !== 429) {
          console.error("Unread count error:", error);
        }
      }
    };

    fetchUnreadCount();

    // Poll slowly instead of calling the API on every render/route change.
    const interval = setInterval(fetchUnreadCount, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, userRole]);

  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      location.pathname === path ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
    }`;

  const currentLanguage =
    { en: { label: "EN", flag: ukFlag }, fr: { label: "FR", flag: frFlag }, ar: { label: "AR", flag: saFlag } }[i18n.language] ||
    { label: "EN", flag: ukFlag };

  // ── Account dropdown menu items ──────────────────────────────
  const menuSections = [
    {
      label: "Account",
      items: [
        {
          icon: User,
          label: t("navbar.profile") || "Profile",
          onClick: () => { setMenuOpen(false); navigate("/account"); },
          show: true,
        },
        {
          icon: LayoutDashboard,
          label: "Admin Dashboard",
          onClick: () => { setMenuOpen(false); navigate("/admin"); },
          show: userRole === "admin",
        },
        {
          icon: LayoutDashboard,
          label: t("navbar.dashboard") || "Dashboard",
          onClick: () => { setMenuOpen(false); navigate("/dashboard"); },
          show: userRole === "business_owner",
        },
        {
          icon: MessageSquare,
          label: "Messages",
          badge: unreadCount > 0 ? unreadCount : null,
          onClick: () => { setMenuOpen(false); navigate("/account/messages"); },
          show: !!token && userRole !== "admin" && userRole !== "business_owner",
        },
        {
          icon: Home,
          label: t("navbar.home") || "Home",
          onClick: () => { setMenuOpen(false); navigate("/"); },
          show: true,
        },
      ].filter((i) => i.show),
    },
    {
      label: "Actions",
      items: [
        {
          icon: LogOut,
          label: t("navbar.logout") || "Logout",
          onClick: handleLogout,
          danger: true,
          show: true,
        },
      ].filter((i) => i.show),
    },
  ];

  // Floating menu variants
  const floatingMenuVariants = {
    closed: { opacity: 0, scale: 0.85, y: -20, transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <style>{`
        .navbar-menu-item { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* ── MAIN NAVBAR ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] w-full bg-[#0a4abf] text-white shadow-md"
        animate={{ y: isScrolled ? -90 : 0, opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Nobty" className="h-10 object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/" className={navLinkClass("/")}>{t("navbar.home") || "Home"}</Link>
            <Link to="/businesses" className={navLinkClass("/businesses")}>{t("navbar.businesses") || "Businesses"}</Link>
            <Link to="/about" className={navLinkClass("/about")}>{t("navbar.about") || "About"}</Link>
            <Link to="/contact" className={navLinkClass("/contact")}>{t("navbar.contact") || "Contact"}</Link>
            {userRole === "admin" && <Link to="/admin" className={navLinkClass("/admin")}>Admin Dashboard</Link>}
            {userRole === "business_owner" && <Link to="/dashboard" className={navLinkClass("/dashboard")}>{t("navbar.dashboard") || "Dashboard"}</Link>}
            {token && userRole !== "admin" && userRole !== "business_owner" && (
              <Link to="/account/messages" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white text-[#0a4abf] transition hover:bg-blue-50" title="Messages">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-7 6 1.675-3.35A8.959 8.959 0 0 1 3 10a9 9 0 1 1 18 0 8.959 8.959 0 0 1-4.675 7.65L18 20l-4.326-1.082A8.966 8.966 0 0 1 12 19a8.966 8.966 0 0 1-1.674-.158L6 20Z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-[#0a4abf] shadow-sm">{unreadCount}</span>
                )}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 overflow-visible">
            {token && <NotificationDropdown />}

            {/* Language switcher */}
            <div className="relative z-[120]" ref={langRef}>
              <button onClick={() => setLangOpen((prev) => !prev)} className="flex items-center gap-2 rounded-md border border-white/30 px-3 py-2 hover:bg-white/10">
                <img src={currentLanguage.flag} alt="flag" className="h-5 w-5 rounded-full" />
                <span className="text-sm font-medium">{currentLanguage.label}</span>
                <span className="text-xs">▼</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full z-[9999] mt-2 w-44 rounded-xl bg-white py-2 text-black shadow-2xl ring-1 ring-black/5">
                  {[{ code: "en", label: "English", flag: ukFlag }, { code: "fr", label: "Français", flag: frFlag }, { code: "ar", label: "العربية", flag: saFlag }].map((l) => (
                    <button key={l.code} onClick={() => changeLanguage(l.code)} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100">
                      <img src={l.flag} alt={l.label} className="h-5 w-5 rounded-full" />
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {!token ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={openRegister} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0a4abf]">
                  {t("navbar.register") || "Register"}
                </button>
                <button type="button" onClick={openLogin} className="rounded-md border border-white px-4 py-2 text-sm font-semibold hover:bg-white/10">
                  {t("navbar.login") || "Login"}
                </button>
              </div>
            ) : (
              <div className="relative z-[120]" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-[#0a4abf] shadow-sm transition hover:shadow-md"
                >
                  {firstLetter}
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute right-0 top-full z-[9999] mt-3 w-64 overflow-hidden rounded-2xl bg-white text-black shadow-[0_8px_32px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
                    >
                      {/* User info header */}
                      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a4abf] font-bold text-white text-sm">
                          {firstLetter}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-semibold text-slate-900">{username}</p>
                          <p className="text-[11.5px] text-slate-400 capitalize">{userRole || "user"}</p>
                        </div>
                      </div>

                      {/* Sections */}
                      {menuSections.map((section, si) => (
                        <div key={si}>
                          <p className="px-4 pt-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                            {section.label}
                          </p>
                          <div className="px-2 pb-1">
                            {section.items.map((item, ii) => (
                              <button
                                key={ii}
                                onClick={item.onClick}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition
                                  ${item.danger
                                    ? "text-red-500 hover:bg-red-50"
                                    : "text-slate-700 hover:bg-slate-50"
                                  }`}
                              >
                                <item.icon size={15} strokeWidth={1.8} className={item.danger ? "text-red-400" : "text-slate-400"} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0a4abf] px-1.5 text-[10px] font-bold text-white">
                                    {item.badge}
                                  </span>
                                )}
                                {!item.danger && !item.badge && (
                                  <ChevronRight size={13} className="text-slate-300" />
                                )}
                              </button>
                            ))}
                          </div>
                          {si < menuSections.length - 1 && <div className="mx-4 border-t border-slate-100" />}
                        </div>
                      ))}
                      <div className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── FLOATING HAMBURGER ── */}
      <motion.div
        className="fixed top-5 right-5 z-[200]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isScrolled ? 1 : 0, opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <motion.button
          onClick={() => setFloatingMenuOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a4abf] text-white shadow-xl"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait">
            {floatingMenuOpen ? (
              <motion.svg key="close" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg key="menu" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ── FLOATING MENU POPUP ── */}
      <AnimatePresence>
        {floatingMenuOpen && isScrolled && (
          <>
            <motion.div
              className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFloatingMenuOpen(false)}
            />
            <motion.div
              className="fixed top-24 right-5 z-[190] w-72 overflow-hidden rounded-2xl bg-white text-black shadow-2xl ring-1 ring-black/10"
              variants={floatingMenuVariants}
              initial="closed" animate="open" exit="closed"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                <img src={logo} alt="Nobty" className="h-8 object-contain" />
              </div>

              {/* Nav links */}
              <div className="px-3 py-3 space-y-0.5">
                {[
                  { path: "/", label: t("navbar.home") || "Home" },
                  { path: "/businesses", label: t("navbar.businesses") || "Businesses" },
                  { path: "/about", label: t("navbar.about") || "About" },
                  { path: "/contact", label: t("navbar.contact") || "Contact" },
                  ...(userRole === "admin" ? [{ path: "/admin", label: "Admin Dashboard" }] : []),
                  ...(userRole === "business_owner" ? [{ path: "/dashboard", label: t("navbar.dashboard") || "Dashboard" }] : []),
                ].map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setFloatingMenuOpen(false)}
                    className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname === item.path ? "bg-[#0a4abf] text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    {item.label}
                  </Link>
                ))}
                {token && userRole !== "admin" && userRole !== "business_owner" && (
                  <Link to="/account/messages" onClick={() => setFloatingMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                    Messages
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0a4abf] px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>
                    )}
                  </Link>
                )}
              </div>

              {/* Language */}
              <div className="border-t border-gray-100 px-5 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Language</p>
                <div className="flex gap-2">
                  {[{ code: "en", label: "EN", flag: ukFlag }, { code: "fr", label: "FR", flag: frFlag }, { code: "ar", label: "AR", flag: saFlag }].map((lang) => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        i18n.language === lang.code ? "bg-[#0a4abf] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>
                      <img src={lang.flag} alt={lang.label} className="h-4 w-4 rounded-full" />
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth */}
              <div className="border-t border-gray-100 px-5 py-3">
                {!token ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setFloatingMenuOpen(false); openRegister(); }}
                      className="flex-1 rounded-lg bg-[#0a4abf] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0939a0]">
                      {t("navbar.register") || "Register"}
                    </button>
                    <button type="button" onClick={() => { setFloatingMenuOpen(false); openLogin(); }}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      {t("navbar.login") || "Login"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a4abf] font-bold text-white">{firstLetter}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{username}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole || "user"}</p>
                      </div>
                      {token && <NotificationDropdown />}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFloatingMenuOpen(false); navigate("/account"); }}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                        {t("navbar.profile") || "Profile"}
                      </button>
                      <button onClick={handleLogout}
                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                        {t("navbar.logout") || "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-1" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}