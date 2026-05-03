import { useLocation } from "react-router-dom";

const titles = {
  "/admin": "Dashboard Overview",
  "/admin/business-requests": "Business Requests",
  "/admin/businesses": "Businesses",
  "/admin/clients": "Clients",
  "/admin/providers": "Providers",
  "/admin/messages": "Messages",
  "/admin/appeals": "Blacklist Appeals",
};

export default function DashboardHeader() {
  const location = useLocation();
  const title = titles[location.pathname] || "Admin Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f5f7fb]/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage Nobty professionally and securely
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Platform control</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
}