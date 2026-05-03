import { useEffect, useMemo, useState } from "react";
import { Users, Search, Phone, CalendarDays, Trash2, Mail } from "lucide-react";
import { getClients, deleteUser } from "../../services/adminService";
import { useTheme } from "../../layouts/AdminLayout";

export default function AdminClients() {
  const { dark } = useTheme();
  const [clients, setClients] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [search, setSearch]   = useState("");

  const fetch_ = async () => {
    setLoad(true);
    try { const d = await getClients(); setClients(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoad(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((u) =>
      [u.email, u.phone].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [clients, search]);

  const del = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try { await deleteUser(id); setClients((p) => p.filter((u) => u._id !== id)); }
    catch { alert("Failed to delete client"); }
  };

  /* tokens */
  const page    = dark ? "text-white"      : "text-slate-900";
  const sub     = dark ? "text-zinc-500"   : "text-slate-400";
  const card    = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const rowHov  = dark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60";
  const metaTx  = dark ? "text-zinc-500"   : "text-slate-500";
  const hdrRow  = dark ? "bg-white/[0.02] border-white/[0.06] text-zinc-500" : "bg-slate-50/60 border-slate-100 text-slate-400";
  const searchB = dark
    ? "bg-[#18181b] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400";

  const avatar = (email) => {
    const initials = email ? email[0].toUpperCase() : "?";
    const colors   = ["bg-violet-500","bg-indigo-500","bg-blue-500","bg-cyan-500","bg-teal-500","bg-emerald-500"];
    const col      = colors[email?.charCodeAt(0) % colors.length] || "bg-indigo-500";
    return { initials, col };
  };

  return (
    <div className="space-y-5 max-w-5xl">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${page}`}>Clients</h1>
          <p className={`mt-0.5 text-sm ${sub}`}>Manage all registered clients on the platform</p>
        </div>
        <span className={`self-start rounded-md px-2.5 py-1 text-xs font-medium ${dark ? "bg-white/[0.06] text-zinc-400" : "bg-slate-100 text-slate-500"}`}>
          {filtered.length} clients
        </span>
      </div>

      <div className="relative max-w-md">
        <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
        <input
          type="text"
          placeholder="Search by email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition ${searchB}`}
        />
      </div>

      <div className={`rounded-xl border ${card} overflow-hidden`}>
        {/* Column headers */}
        <div className={`grid grid-cols-12 border-b px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${hdrRow}`}>
          <div className="col-span-5">User</div>
          <div className="col-span-4 hidden sm:block">Phone</div>
          <div className="col-span-2 hidden md:block">Joined</div>
          <div className="col-span-1 text-right">Del</div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <Users size={26} className={sub} />
            <p className={`text-sm font-medium ${page}`}>No clients found</p>
          </div>
        ) : (
          filtered.map((user) => {
            const { initials, col } = avatar(user.email);
            return (
              <div
                key={user._id}
                className={`grid grid-cols-12 items-center gap-2 border-b px-4 py-3 last:border-b-0 transition ${rowHov} ${dark ? "border-white/[0.04]" : "border-slate-50"}`}
              >
                {/* User */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className={`h-8 w-8 shrink-0 rounded-full ${col} flex items-center justify-center text-[11px] font-bold text-white`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${page}`}>{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-4 hidden sm:flex items-center gap-1 text-xs ${metaTx}">
                  <Phone size={11} className="opacity-50 shrink-0" />
                  <span className={metaTx}>{user.phone || "—"}</span>
                </div>

                {/* Joined */}
                <div className="col-span-2 hidden md:flex items-center gap-1 text-xs">
                  <CalendarDays size={11} className={`opacity-50 shrink-0 ${metaTx}`} />
                  <span className={metaTx}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => del(user._id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
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