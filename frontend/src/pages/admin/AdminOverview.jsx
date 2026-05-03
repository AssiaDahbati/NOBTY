import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, CalendarDays, Clock3, Users, Briefcase,
  ArrowUpRight, TrendingUp, ShieldCheck, MessageSquare,
} from "lucide-react";
import { getAdminStats } from "../../services/adminService";
import { useTheme } from "../../layouts/AdminLayout";

function StatCard({ title, value, subtitle, icon: Icon, accent, dark }) {
  const cardBg    = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const titleTxt  = dark ? "text-zinc-400"  : "text-slate-500";
  const valueTxt  = dark ? "text-white"     : "text-slate-900";
  const subTxt    = dark ? "text-zinc-600"  : "text-slate-400";

  return (
    <div className={`relative rounded-xl border p-5 transition hover:shadow-sm ${cardBg}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium ${titleTxt}`}>{title}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${valueTxt}`}>
            {value ?? "—"}
          </p>
          <p className={`mt-1 text-xs ${subTxt}`}>{subtitle}</p>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: accent + "18", color: accent }}
        >
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ label, sub, icon: Icon, onClick, primary, dark }) {
  const base =
    "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition group";
  const pri  = dark
    ? `${base} bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500`
    : `${base} bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700`;
  const sec  = dark
    ? `${base} bg-[#18181b] border-white/[0.06] text-white hover:bg-white/[0.04]`
    : `${base} bg-white border-slate-100 text-slate-900 hover:border-slate-200 hover:shadow-sm`;

  return (
    <button onClick={onClick} className={primary ? pri : sec}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          primary
            ? "bg-white/20 text-white"
            : dark ? "bg-white/[0.07] text-zinc-300" : "bg-slate-50 text-indigo-600"
        }`}
      >
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{label}</p>
        <p className={`text-[11px] truncate ${primary ? "text-white/60" : dark ? "text-zinc-600" : "text-slate-400"}`}>
          {sub}
        </p>
      </div>
      <ArrowUpRight
        size={14}
        className={`shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
      />
    </button>
  );
}

export default function AdminOverview() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [stats, setStats] = useState({
    totalUsers: 0, totalProviders: 0,
    totalBusinesses: 0, pendingBusinesses: 0, totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((d) => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cardBg   = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const sectionT = dark ? "text-white"   : "text-slate-900";
  const subT     = dark ? "text-zinc-500": "text-slate-400";
  const divider  = dark ? "divide-white/[0.06]" : "divide-slate-100";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Page title */}
      <div>
        <h1 className={`text-xl font-bold ${sectionT}`}>Dashboard</h1>
        <p className={`mt-0.5 text-sm ${subT}`}>Platform summary and quick actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Clients"      value={stats.totalUsers}        subtitle="Registered"      icon={Users}        accent="#6366f1" dark={dark} />
        <StatCard title="Providers"    value={stats.totalProviders}    subtitle="Business owners" icon={Briefcase}    accent="#3b82f6" dark={dark} />
        <StatCard title="Businesses"   value={stats.totalBusinesses}   subtitle="All registered"  icon={Building2}    accent="#06b6d4" dark={dark} />
        <StatCard title="Pending"      value={stats.pendingBusinesses} subtitle="Need review"     icon={Clock3}       accent="#f59e0b" dark={dark} />
        <StatCard title="Appointments" value={stats.totalAppointments} subtitle="Total bookings"  icon={CalendarDays} accent="#10b981" dark={dark} />
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Activity area */}
        <div className={`xl:col-span-2 rounded-xl border ${cardBg} p-5`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-sm font-semibold ${sectionT}`}>Platform Activity</h2>
              <p className={`text-xs mt-0.5 ${subT}`}>Registrations & bookings overview</p>
            </div>
            <span className={`text-[11px] rounded-md px-2.5 py-1 font-medium ${dark ? "bg-white/[0.06] text-zinc-400" : "bg-slate-50 text-slate-500"}`}>
              This month
            </span>
          </div>

          <div className={`flex h-52 items-center justify-center rounded-lg border border-dashed ${dark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50/60"}`}>
            <div className="text-center">
              <TrendingUp size={28} className={dark ? "mx-auto text-zinc-700" : "mx-auto text-slate-300"} />
              <p className={`mt-2 text-xs font-medium ${subT}`}>Analytics chart coming soon</p>
            </div>
          </div>

          {/* Summary row */}
          <div className={`mt-4 grid grid-cols-3 divide-x rounded-lg ${divider} ${dark ? "bg-white/[0.03]" : "bg-slate-50"} py-3`}>
            {[
              { label: "Avg. daily signups", val: "—" },
              { label: "Approval rate",      val: "—" },
              { label: "Pending now",        val: stats.pendingBusinesses },
            ].map((s) => (
              <div key={s.label} className="px-4 text-center">
                <p className={`text-lg font-bold ${sectionT}`}>{s.val}</p>
                <p className={`text-[11px] mt-0.5 ${subT}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className={`rounded-xl border ${cardBg} p-5`}>
          <h2 className={`text-sm font-semibold ${sectionT} mb-1`}>Quick Actions</h2>
          <p className={`text-xs ${subT} mb-4`}>Jump to key tasks</p>

          <div className="space-y-2">
            <QuickBtn
              label="Review Requests"
              sub={`${stats.pendingBusinesses} pending`}
              icon={ShieldCheck}
              onClick={() => navigate("/admin/business-requests")}
              primary dark={dark}
            />
            <QuickBtn
              label="All Businesses"
              sub={`${stats.totalBusinesses} registered`}
              icon={Building2}
              onClick={() => navigate("/admin/businesses")}
              dark={dark}
            />
            <QuickBtn
              label="Messages"
              sub="Review contact submissions"
              icon={MessageSquare}
              onClick={() => navigate("/admin/messages")}
              dark={dark}
            />
            <QuickBtn
              label="Clients"
              sub={`${stats.totalUsers} total clients`}
              icon={Users}
              onClick={() => navigate("/admin/clients")}
              dark={dark}
            />
            <QuickBtn
              label="Providers"
              sub={`${stats.totalProviders} registered`}
              icon={Briefcase}
              onClick={() => navigate("/admin/providers")}
              dark={dark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}