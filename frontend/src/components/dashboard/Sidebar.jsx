import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  Briefcase,
  Mail,
  ShieldAlert,
  ExternalLink,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Overview", to: "/admin", icon: LayoutDashboard },
  { name: "Business Requests", to: "/admin/business-requests", icon: ClipboardList },
  { name: "Businesses", to: "/admin/businesses", icon: Building2 },
  { name: "Clients", to: "/admin/clients", icon: Users },
  { name: "Providers", to: "/admin/providers", icon: Briefcase },
  { name: "Messages", to: "/admin/messages", icon: Mail },
  { name: "Blacklist Appeals", to: "/admin/appeals", icon: ShieldAlert },
];

export default function Sidebar() {
  const navigate = useNavigate();

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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col bg-[#0f172a] text-white shadow-2xl">
      <div className="px-6 py-7 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">Nobty Admin</h1>
        <p className="mt-1 text-sm text-slate-300">Platform management</p>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={19} />
          <span className="font-medium">View Website</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={19} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
