import { useState, createContext, useContext } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, ClipboardList,
  Users, Briefcase, MessageSquare, ShieldAlert,
  ChevronLeft, ChevronRight, LogOut, Menu, X, Sun, Moon,
} from "lucide-react";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

// NOBTY brand blue — sampled from the logo background
const BRAND_BLUE      = "#1A52CC";
const BRAND_BLUE_DARK = "#1648B8"; // slightly darker for dark mode

const NAV = [
  {
    group: "Main",
    items: [{ label: "Overview", icon: LayoutDashboard, path: "/admin" }],
  },
  {
    group: "Businesses",
    items: [
      { label: "Requests",       icon: ClipboardList, path: "/admin/business-requests" },
      { label: "All Businesses", icon: Building2,     path: "/admin/businesses"         },
    ],
  },
  {
    group: "Users",
    items: [
      { label: "Clients",   icon: Users,     path: "/admin/clients"   },
      { label: "Providers", icon: Briefcase, path: "/admin/providers" },
    ],
  },
  {
    group: "Support",
    items: [
      { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
      { label: "Appeals",  icon: ShieldAlert,   path: "/admin/appeals"  },
    ],
  },
];

function Sidebar({ dark, toggleDark, collapsed, setCollapsed, closeMobile, isMobile, onLogout }) {
  const location = useLocation();

  const active = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  // Sidebar always uses the NOBTY blue, regardless of dark/light app theme
  const sidebarBg  = dark ? BRAND_BLUE_DARK : BRAND_BLUE;
  const borderCol  = "border-white/[0.12]";
  const muted      = "text-white/50";
  const label      = "text-white/75";
  const hoverCls   = "hover:bg-white/[0.1] hover:text-white";
  const activeCls  = "bg-white/[0.15] text-white font-semibold";
  const groupLabel = "text-white/30";

  return (
    <aside
      style={{ backgroundColor: sidebarBg }}
      className={`
        flex flex-col h-full border-r transition-all duration-300 ease-in-out
        ${borderCol}
        ${isMobile ? "w-60" : collapsed ? "w-[60px]" : "w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className={`flex h-[52px] shrink-0 items-center border-b ${borderCol} px-3`}>
        {(!collapsed || isMobile) && (
          <div className="flex-1 min-w-0 flex items-center">
            <img
              src="/NOBTY.png"
              alt="NOBTY"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "block";
              }}
            />
            {/* Fallback text rendered inline if image fails */}
            <span className="hidden text-sm font-black tracking-[0.18em] text-white">NOBTY</span>
          </div>
        )}
        {collapsed && !isMobile && (
          <div className="flex-1 flex justify-center">
            {/* Collapsed: show small clock icon as brand mark */}
            <span className="text-xs font-black tracking-widest text-white">N</span>
          </div>
        )}
        {isMobile ? (
          <button onClick={closeMobile} className={`ml-auto p-1.5 rounded-md transition ${muted} ${hoverCls}`}>
            <X size={15} />
          </button>
        ) : (
          <button onClick={() => setCollapsed((v) => !v)} className={`ml-auto p-1.5 rounded-md transition ${muted} ${hoverCls}`}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV.map((group) => (
          <div key={group.group}>
            {(!collapsed || isMobile) && (
              <p className={`mt-4 mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${groupLabel}`}>
                {group.group}
              </p>
            )}
            {collapsed && !isMobile && <div className="my-3 mx-auto h-px w-5 bg-white/20" />}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isAct = active(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={isMobile ? closeMobile : undefined}
                  className={`
                    group relative flex items-center rounded-md text-[13px] transition-all px-2.5 py-[7px]
                    ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
                    ${isAct ? activeCls : `${label} ${hoverCls}`}
                  `}
                >
                  {isAct && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                  )}
                  <Icon
                    size={15}
                    className={`shrink-0 ${isAct ? "text-white" : "opacity-70"}`}
                  />
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}

                  {/* Tooltip when collapsed */}
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

      {/* Footer */}
      <div className={`shrink-0 border-t ${borderCol} px-2 py-2 space-y-0.5`}>
        <button
          onClick={toggleDark}
          className={`
            flex w-full items-center rounded-md text-[13px] px-2.5 py-[7px] transition
            ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
            ${muted} ${hoverCls}
          `}
        >
          {dark ? <Sun size={14} className="shrink-0" /> : <Moon size={14} className="shrink-0" />}
          {(!collapsed || isMobile) && <span>{dark ? "Light mode" : "Dark mode"}</span>}
        </button>

        <button
          onClick={onLogout}
          className={`
            flex w-full items-center rounded-md text-[13px] px-2.5 py-[7px] transition
            ${collapsed && !isMobile ? "justify-center" : "gap-2.5"}
            ${muted} hover:bg-white/[0.1] hover:text-white
          `}
        >
          <LogOut size={14} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const [dark, setDark]             = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleDark = () => setDark((v) => !v);

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = () => {
    // Clear ALL auth data first
    localStorage.clear();
    sessionStorage.clear();

    // Hard redirect to home — bypasses any route guards that might
    // redirect back to /admin before React state updates
    window.location.href = "/";
  };
  // ─────────────────────────────────────────────────────────────────────────

  const pageTitle = () => {
    const flat = NAV.flatMap((g) => g.items);
    const match = flat.find((i) =>
      i.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(i.path)
    );
    return match?.label ?? "Dashboard";
  };

  const rootBg = dark ? "bg-[#0d0d0e]" : "bg-[#f6f7f9]";
  const hdrBg  = dark ? "bg-[#111113]/90 border-white/[0.06]" : "bg-white/90 border-slate-100";
  const hdrTxt = dark ? "text-white"   : "text-slate-900";
  const breadMut = dark ? "text-zinc-600" : "text-slate-400";

  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleDark }}>
      <div className={`flex min-h-screen ${rootBg} transition-colors duration-200`}>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex shrink-0 sticky top-0 h-screen">
          <Sidebar
            dark={dark} toggleDark={toggleDark}
            collapsed={collapsed} setCollapsed={setCollapsed}
            closeMobile={() => {}} isMobile={false}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative z-10 h-full">
              <Sidebar
                dark={dark} toggleDark={toggleDark}
                collapsed={false} setCollapsed={() => {}}
                closeMobile={() => setMobileOpen(false)} isMobile={true}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className={`sticky top-0 z-30 flex h-[52px] items-center gap-3 border-b px-5 backdrop-blur-md transition-colors ${hdrBg}`}>
            <button onClick={() => setMobileOpen(true)} className={`p-1 rounded-md lg:hidden ${breadMut}`}>
              <Menu size={17} />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] ${breadMut}`}>Admin</span>
              <span className={`text-[11px] ${breadMut}`}>/</span>
              <span className={`text-[11px] font-semibold ${hdrTxt}`}>{pageTitle()}</span>
            </div>

            <div className="ml-auto">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#1A52CC] to-[#5B8DEF] flex items-center justify-center text-[10px] font-bold text-white">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-5 lg:p-7">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}