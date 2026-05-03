import { useEffect, useMemo, useState } from "react";
import {
  Search, Users, Phone, CalendarDays, Trash2, RefreshCcw, Briefcase,
} from "lucide-react";
import { getProviders, deleteUser } from "../../services/adminService";
import { useTheme } from "../../layouts/AdminLayout";

export default function AdminProviders() {
  const { dark } = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoad]        = useState(true);
  const [search, setSearch]       = useState("");
  const [busyId, setBusy]         = useState(null);

  const fetch_ = async () => {
    setLoad(true);
    try { const d = await getProviders(); setProviders(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoad(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) =>
      [p.email, p.phone, p.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [providers, search]);

  const del = async (id) => {
    if (!window.confirm("Delete this provider?")) return;
    setBusy(id);
    try {
      await deleteUser(id);
      setProviders((p) => p.filter((u) => u._id !== id));
    } catch { alert("Failed to delete"); }
    finally { setBusy(null); }
  };

  /* tokens */
  const page    = dark ? "text-white"     : "text-slate-900";
  const sub     = dark ? "text-zinc-500"  : "text-slate-400";
  const card    = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const rowHov  = dark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60";
  const metaTx  = dark ? "text-zinc-500"  : "text-slate-500";
  const hdrRow  = dark ? "bg-white/[0.02] border-white/[0.06] text-zinc-500" : "bg-slate-50/60 border-slate-100 text-slate-400";
  const searchB = dark
    ? "bg-[#18181b] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400";

  const avatar = (email) => {
    const initials = email ? email[0].toUpperCase() : "?";
    const colors   = ["bg-blue-500","bg-indigo-500","bg-violet-500","bg-fuchsia-500","bg-rose-500","bg-amber-500"];
    const col      = colors[email?.charCodeAt(0) % colors.length] || "bg-blue-500";
    return { initials, col };
  };

  return (
    <div className="space-y-5 max-w-5xl">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${page}`}>Providers</h1>
          <p className={`mt-0.5 text-sm ${sub}`}>Manage all business owners registered on the platform</p>
        </div>
        <span className={`self-start rounded-md px-2.5 py-1 text-xs font-medium ${dark ? "bg-white/[0.06] text-zinc-400" : "bg-slate-100 text-slate-500"}`}>
          {filtered.length} providers
        </span>
      </div>

      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
          <input
            type="text"
            placeholder="Search by email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition ${searchB}`}
          />
        </div>
        <button
          onClick={fetch_}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${card} ${metaTx} hover:opacity-80`}
        >
          <RefreshCcw size={13} />
        </button>
      </div>

      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className={`grid grid-cols-12 border-b px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${hdrRow}`}>
          <div className="col-span-5">Provider</div>
          <div className="col-span-3 hidden sm:block">Phone</div>
          <div className="col-span-3 hidden md:block">Joined</div>
          <div className="col-span-1 text-right">Del</div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <Users size={26} className={sub} />
            <p className={`text-sm font-medium ${page}`}>No providers found</p>
          </div>
        ) : (
          filtered.map((provider) => {
            const { initials, col } = avatar(provider.email);
            const busy = busyId === provider._id;

            return (
              <div
                key={provider._id}
                className={`grid grid-cols-12 items-center gap-2 border-b px-4 py-3 last:border-b-0 transition ${rowHov} ${dark ? "border-white/[0.04]" : "border-slate-50"}`}
              >
                {/* Provider */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className={`h-8 w-8 shrink-0 rounded-full ${col} flex items-center justify-center text-[11px] font-bold text-white`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${page}`}>{provider.email}</p>
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                      <Briefcase size={9} /> Owner
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-3 hidden sm:flex items-center gap-1 text-xs">
                  <Phone size={11} className={`opacity-50 shrink-0 ${metaTx}`} />
                  <span className={metaTx}>{provider.phone || "—"}</span>
                </div>

                {/* Joined */}
                <div className="col-span-3 hidden md:flex items-center gap-1 text-xs">
                  <CalendarDays size={11} className={`opacity-50 shrink-0 ${metaTx}`} />
                  <span className={metaTx}>
                    {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => del(provider._id)}
                    disabled={busy}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}