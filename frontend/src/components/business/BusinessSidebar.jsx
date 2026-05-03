import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Clock3,
  BarChart3,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  TimerReset,
  Store,
  ChevronRight,
} from "lucide-react";
import { DashboardThemeContext } from "../../layouts/BusinessLayout";

const navGroups = [
  {
    label: "Main",
    items: [{ name: "Overview", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { name: "Appointments", to: "/dashboard/appointments", icon: CalendarDays },
      { name: "Services", to: "/dashboard/services", icon: Scissors },
      { name: "Schedule", to: "/dashboard/schedule", icon: Clock3 },
    ],
  },
  {
    label: "Growth",
    items: [
      { name: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
      { name: "Reviews", to: "/dashboard/reviews", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [{ name: "Settings", to: "/dashboard/settings", icon: Settings }],
  },
];

function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export default function BusinessSidebar() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DashboardThemeContext);

  const [secondsSpent, setSecondsSpent] = useState(() => {
    const saved = sessionStorage.getItem("nobty_dashboard_session_seconds");
    return saved ? Number(saved) : 0;
  });

  const businessName =
    localStorage.getItem("businessName") ||
    localStorage.getItem("username") ||
    "Business";

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSpent((prev) => {
        const next = prev + 1;
        sessionStorage.setItem("nobty_dashboard_session_seconds", String(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("businessId");
    localStorage.removeItem("user");
    sessionStorage.removeItem("nobty_dashboard_session_seconds");
    navigate("/login");
  };

  const shell = darkMode
    ? "border-slate-800 bg-[#07111f] text-white"
    : "border-slate-200 bg-white text-slate-900";

  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const subtle = darkMode ? "text-slate-500" : "text-slate-400";

  return (
    <aside
      className={`fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r shadow-[18px_0_60px_rgba(15,23,42,0.06)] lg:flex ${shell}`}
    >
      {/* Brand */}
      <div
        className={`flex h-[72px] items-center border-b px-5 ${
          darkMode ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A52CC] text-white shadow-sm">
            <Store size={19} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight">
              NOBTY Business
            </h1>
            <p className={`truncate text-xs ${subtle}`}>SaaS workspace</p>
          </div>
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-4 py-4">
        <div
          className={`rounded-xl border p-3 ${
            darkMode
              ? "border-slate-800 bg-[#0d1728]"
              : "border-slate-100 bg-slate-50/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A52CC]/10 text-[#1A52CC]">
              <Store size={16} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{businessName}</p>
              <p className={`text-xs ${subtle}`}>Business account</p>
            </div>
          </div>

          <Link
            to="/"
            className={`mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition ${
              darkMode
                ? "border-slate-800 bg-[#07111f] text-slate-300 hover:bg-white/[0.04]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            View website
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Session */}
      <div className="px-4">
        <div
          className={`rounded-xl border px-3 py-3 ${
            darkMode
              ? "border-slate-800 bg-[#0d1728]"
              : "border-slate-100 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                darkMode
                  ? "bg-blue-500/10 text-blue-300"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <TimerReset size={15} />
            </div>

            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${subtle}`}>
                Session time
              </p>
              <p className="mt-0.5 text-sm font-bold">
                {formatSeconds(secondsSpent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex === 0 ? "" : "mt-4"}>
            <p
              className={`mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] ${subtle}`}
            >
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.03 * index + groupIndex * 0.04,
                    }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/dashboard"}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? darkMode
                              ? "bg-[#1A52CC] text-white shadow-sm"
                              : "bg-[#1A52CC] text-white shadow-sm"
                            : darkMode
                            ? "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${
                              isActive
                                ? "bg-white/15 text-white"
                                : darkMode
                                ? "bg-white/[0.04] text-slate-400 group-hover:text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#1A52CC]"
                            }`}
                          >
                            <Icon size={15} />
                          </span>

                          <span className="min-w-0 flex-1 truncate">{item.name}</span>

                          {isActive && <ChevronRight size={14} className="opacity-80" />}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`border-t p-4 ${
          darkMode ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            darkMode
              ? "text-slate-400 hover:bg-red-500/10 hover:text-red-300"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-md ${
              darkMode ? "bg-white/[0.04]" : "bg-slate-100"
            }`}
          >
            <LogOut size={15} />
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}