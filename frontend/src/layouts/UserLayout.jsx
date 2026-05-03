import React, { createContext, useContext, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const UserDashboardContext = createContext({});
export const useUserDashboard = () => useContext(UserDashboardContext);

const BRAND_BLUE = "#1A52CC";

const NAV = [
  {
    group: "Main",
    items: [{ label: "Overview", icon: LayoutDashboard, path: "/account" }],
  },
  {
    group: "Activity",
    items: [
      { label: "Appointments", icon: CalendarDays, path: "/account/appointments" },
      { label: "Messages", icon: Mail, path: "/account/messages" },
    ],
  },
  {
    group: "Account",
    items: [{ label: "Settings", icon: Settings, path: "/account/settings" }],
  },
];

function Sidebar({ collapsed, setCollapsed, closeMobile, isMobile, onLogout }) {
  const location = useLocation();

  const active = (path) =>
    path === "/account"
      ? location.pathname === "/account"
      : location.pathname.startsWith(path);

  return (
    <aside
      style={{ backgroundColor: BRAND_BLUE }}
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

      <div className="shrink-0 border-t border-white/[0.12] px-2 py-2">
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

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("businessId");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <UserDashboardContext.Provider value={{}}>
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            closeMobile={() => {}}
            isMobile={false}
            onLogout={handleLogout}
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
                collapsed={false}
                setCollapsed={() => {}}
                closeMobile={() => setMobileOpen(false)}
                isMobile
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 lg:hidden"
        >
          <Menu size={18} />
        </button>

        <main className="min-w-0 flex-1 overflow-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </UserDashboardContext.Provider>
  );
}