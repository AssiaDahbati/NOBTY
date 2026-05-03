import React, { createContext, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Clock3,
  BarChart3,
  MessageSquare,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  TimerReset,
} from "lucide-react";

export const DashboardThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

const BRAND_BLUE = "#1A52CC";
const BRAND_BLUE_DARK = "#1648B8";

const NAV = [
  {
    group: "Main",
    items: [{ label: "Overview", icon: LayoutDashboard, path: "/dashboard" }],
  },
  {
    group: "Bookings",
    items: [
      { label: "Appointments", icon: CalendarDays, path: "/dashboard/appointments" },
      { label: "Schedule", icon: Clock3, path: "/dashboard/schedule" },
    ],
  },
  {
    group: "Business",
    items: [
      { label: "Services", icon: Scissors, path: "/dashboard/services" },
      { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
      { label: "Reviews", icon: MessageSquare, path: "/dashboard/reviews" },
    ],
  },
  {
    group: "Account",
    items: [{ label: "Settings", icon: Settings, path: "/dashboard/settings" }],
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

function Sidebar({
  dark,
  toggleDark,
  collapsed,
  setCollapsed,
  closeMobile,
  isMobile,
  onLogout,
  secondsSpent,
}) {
  const location = useLocation();

  const active = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const sidebarBg = dark ? BRAND_BLUE_DARK : BRAND_BLUE;

  return (
    <aside
      style={{ backgroundColor: sidebarBg }}
      className={`
        flex h-full flex-col border-r border-white/[0.12] transition-all duration-300
        ${isMobile ? "w-60" : collapsed ? "w-[60px]" : "w-[220px]"}
      `}
    >
      <div className="flex h-[52px] shrink-0 items-center border-b border-white/[0.12] px-3">
        {(!collapsed || isMobile) && (
          <div className="flex min-w-0 flex-1 items-center">
            <img
              src="/NOBTY.png"
              alt="NOBTY"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "block";
              }}
            />
            <span className="hidden text-sm font-black tracking-[0.18em] text-white">
              NOBTY
            </span>
          </div>
        )}

        {collapsed && !isMobile && (
          <div className="flex flex-1 justify-center">
            <span className="text-xs font-black tracking-widest text-white">N</span>
          </div>
        )}

        {isMobile ? (
          <button
            onClick={closeMobile}
            className="ml-auto rounded-md p-1.5 text-white/50 transition hover:bg-white/[0.1] hover:text-white"
          >
            <X size={15} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto rounded-md p-1.5 text-white/50 transition hover:bg-white/[0.1] hover:text-white"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      <div className="px-2 pt-3">
        <NavLink
          to="/"
          className={`
            flex items-center rounded-md px-2.5 py-[7px] text-[13px] text-white/75 transition hover:bg-white/[0.1] hover:text-white
            ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
          `}
        >
          <ExternalLink size={14} className="shrink-0" />
          {(!collapsed || isMobile) && <span>View website</span>}
        </NavLink>

        {(!collapsed || isMobile) && (
          <div className="mt-3 rounded-md border border-white/[0.12] bg-white/[0.08] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <TimerReset size={14} className="text-white/70" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Session
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-white">
              {formatSeconds(secondsSpent)}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV.map((group) => (
          <div key={group.group}>
            {(!collapsed || isMobile) && (
              <p className="mb-1 mt-4 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
                {group.group}
              </p>
            )}

            {collapsed && !isMobile && <div className="mx-auto my-3 h-px w-5 bg-white/20" />}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isAct = active(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={isMobile ? closeMobile : undefined}
                  className={`
                    group relative flex items-center rounded-md px-2.5 py-[7px] text-[13px] transition-all
                    ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
                    ${
                      isAct
                        ? "bg-white/[0.15] font-semibold text-white"
                        : "text-white/75 hover:bg-white/[0.1] hover:text-white"
                    }
                  `}
                >
                  {isAct && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                  )}

                  <Icon size={15} className={`shrink-0 ${isAct ? "text-white" : "opacity-70"}`} />

                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}

                  {collapsed && !isMobile && (
                    <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg group-hover:block">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-white/[0.12] px-2 py-2">
        <button
          onClick={toggleDark}
          className={`
            flex w-full items-center rounded-md px-2.5 py-[7px] text-[13px] text-white/50 transition hover:bg-white/[0.1] hover:text-white
            ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
          `}
        >
          {dark ? <Sun size={14} className="shrink-0" /> : <Moon size={14} className="shrink-0" />}
          {(!collapsed || isMobile) && <span>{dark ? "Light mode" : "Dark mode"}</span>}
        </button>

        <button
          onClick={onLogout}
          className={`
            flex w-full items-center rounded-md px-2.5 py-[7px] text-[13px] text-white/50 transition hover:bg-white/[0.1] hover:text-white
            ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
          `}
        >
          <LogOut size={14} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

export default function BusinessLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("nobty-dashboard-theme") === "dark";
  });

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [secondsSpent, setSecondsSpent] = useState(() => {
    const saved = sessionStorage.getItem("nobty_dashboard_session_seconds");
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("nobty-dashboard-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
    document.body.style.backgroundColor = darkMode ? "#0d0d0e" : "#f6f7f9";
  }, [darkMode]);

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

  const themeValue = useMemo(
    () => ({
      darkMode,
      setDarkMode,
    }),
    [darkMode]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("businessId");
    localStorage.removeItem("user");
    sessionStorage.removeItem("nobty_dashboard_session_seconds");
    window.location.href = "/";
  };

  return (
    <DashboardThemeContext.Provider value={themeValue}>
      <div
        className={`flex min-h-screen transition-colors duration-200 ${
          darkMode ? "bg-[#0d0d0e] text-white" : "bg-[#f6f7f9] text-slate-900"
        }`}
      >
        <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
          <Sidebar
            dark={darkMode}
            toggleDark={() => setDarkMode((v) => !v)}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            closeMobile={() => {}}
            isMobile={false}
            onLogout={handleLogout}
            secondsSpent={secondsSpent}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <div className="relative z-10 h-full">
              <Sidebar
                dark={darkMode}
                toggleDark={() => setDarkMode((v) => !v)}
                collapsed={false}
                setCollapsed={() => {}}
                closeMobile={() => setMobileOpen(false)}
                isMobile
                onLogout={handleLogout}
                secondsSpent={secondsSpent}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setMobileOpen(true)}
          className={`fixed left-4 top-4 z-40 rounded-lg p-2 shadow-sm ring-1 lg:hidden ${
            darkMode
              ? "bg-[#18181b] text-zinc-300 ring-white/[0.08]"
              : "bg-white text-slate-500 ring-slate-200"
          }`}
        >
          <Menu size={18} />
        </button>

        <main className="min-w-0 flex-1 overflow-auto p-5 lg:p-7">
          <Outlet context={{ darkMode, setDarkMode }} />
        </main>
      </div>
    </DashboardThemeContext.Provider>
  );
}