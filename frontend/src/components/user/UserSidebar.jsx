import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  Crown,
  UserRound,
} from "lucide-react";

const navItems = [
  { name: "Overview", to: "/account", icon: LayoutDashboard },
  { name: "Appointments", to: "/account/appointments", icon: CalendarDays },
  { name: "Messages", to: "/account/messages", icon: Mail },
  { name: "Settings", to: "/account/settings", icon: Settings },
];

export default function UserSidebar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "NOBTY User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("businessId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r border-slate-200/70 bg-white/90 text-slate-900 shadow-[18px_0_60px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:flex">
      {/* Brand */}
      <div className="px-5 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a4abf] text-white shadow-[0_10px_30px_rgba(10,74,191,0.28)]">
            <Sparkles size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-950">
              NOBTY
            </h1>
            <p className="text-xs font-medium text-slate-400">
              Personal Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Profile card */}
      <div className="px-4">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f6f9ff] to-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a4abf]/10 text-[#0a4abf]">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {username}
              </p>
              <p className="text-xs text-slate-500">Client account</p>
            </div>
          </div>

          <Link
            to="/"
            className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-[#0a4abf]"
          >
            View Website
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-4">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
          Menu
        </p>

        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/account"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#0a4abf] text-white shadow-[0_12px_30px_rgba(10,74,191,0.25)]"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#0a4abf]"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span>{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Upgrade card */}
      <div className="px-4 pb-4">
        <div className="rounded-[24px] bg-slate-950 p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.20)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Crown size={19} />
          </div>

          <h3 className="mt-3 text-sm font-semibold">Book smarter</h3>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Manage appointments, messages, and settings from one clean dashboard.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}