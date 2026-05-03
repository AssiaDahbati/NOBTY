import { useEffect, useMemo, useState } from "react";
import {
  Building2, Search, ShieldCheck, MapPin, Tag,
  Mail, Phone, Pencil, Trash2, X, RefreshCcw,
} from "lucide-react";
import {
  getAllBusinessesForAdmin, deleteBusinessByAdmin, updateBusinessByAdmin,
} from "../../services/adminService";
import { useTheme } from "../../layouts/AdminLayout";

const FALLBACK =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=70";

function EditModal({ business, onClose, onSaved, dark }) {
  const [form, setForm] = useState({
    businessName: business.businessName || "",
    category:     business.category     || "",
    city:         business.city         || "",
    address:      business.address      || "",
    phone:        business.phone        || "",
    description:  business.description  || "",
    isApproved:   business.isApproved   ? "true" : "false",
  });
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await updateBusinessByAdmin(business._id, fd);
      onSaved();
    } catch { alert("Failed to update"); }
    finally { setLoading(false); }
  };

  const overlay = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm";
  const modalBg = dark
    ? "w-full max-w-xl rounded-2xl bg-[#18181b] border border-white/[0.08] shadow-2xl p-6"
    : "w-full max-w-xl rounded-2xl bg-white border border-slate-100 shadow-2xl p-6";
  const inputCls = dark
    ? "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition"
    : "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white transition";
  const labelCls = dark ? "text-zinc-400" : "text-slate-600";
  const titleCls = dark ? "text-white"    : "text-slate-900";

  return (
    <div className={overlay}>
      <div className={modalBg}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-base font-bold ${titleCls}`}>Edit Business</h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "text-zinc-500 hover:text-white hover:bg-white/[0.06]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"} transition`}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Business name</label>
              <input name="businessName" value={form.businessName} onChange={set} placeholder="Name" className={inputCls} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Category</label>
              <input name="category" value={form.category} onChange={set} placeholder="Category" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelCls}`}>City</label>
              <input name="city" value={form.city} onChange={set} placeholder="City" className={inputCls} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Phone</label>
              <input name="phone" value={form.phone} onChange={set} placeholder="Phone" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Address</label>
            <input name="address" value={form.address} onChange={set} placeholder="Address" className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Description</label>
            <textarea name="description" value={form.description} onChange={set} rows={3} placeholder="Description" className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Status</label>
            <select name="isApproved" value={form.isApproved} onChange={set} className={inputCls}>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${dark ? "border-white/[0.08] text-zinc-400 hover:text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBusinesses() {
  const { dark } = useTheme();
  const [items, setItems]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEdit]  = useState(null);

  const fetch_ = async () => {
    setLoad(true);
    try { const d = await getAllBusinessesForAdmin(); setItems(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoad(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((b) =>
      [b.businessName, b.category, b.city, b.address, b.description, b.owner?.email, b.phone]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [items, search]);

  const del = async (id) => {
    if (!window.confirm("Delete this business?")) return;
    try {
      await deleteBusinessByAdmin(id);
      setItems((p) => p.filter((b) => b._id !== id));
    } catch { alert("Failed to delete"); }
  };

  /* ── tokens ── */
  const page    = dark ? "text-white"         : "text-slate-900";
  const sub     = dark ? "text-zinc-500"      : "text-slate-400";
  const card    = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const rowBg   = dark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-slate-100";
  const rowHov  = dark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50/60";
  const metaTx  = dark ? "text-zinc-500"     : "text-slate-500";
  const searchB = dark
    ? "bg-[#18181b] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400";

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${page}`}>Businesses</h1>
          <p className={`mt-0.5 text-sm ${sub}`}>Manage all businesses on the platform</p>
        </div>
        <span className={`self-start rounded-md px-2.5 py-1 text-xs font-medium ${dark ? "bg-white/[0.06] text-zinc-400" : "bg-slate-100 text-slate-500"}`}>
          {filtered.length} businesses
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
          <input
            type="text"
            placeholder="Search name, city, category, owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition ${searchB}`}
          />
        </div>
        <button onClick={fetch_}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${card} ${metaTx} hover:opacity-80`}>
          <RefreshCcw size={13} />
        </button>
      </div>

      {/* Table-like list */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <Building2 size={28} className={sub} />
            <p className={`text-sm font-medium ${page}`}>No businesses found</p>
          </div>
        ) : (
          <div>
            {/* Column headers */}
            <div className={`grid grid-cols-12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${metaTx} ${dark ? "border-b border-white/[0.06] bg-white/[0.02]" : "border-b border-slate-100 bg-slate-50/60"}`}>
              <div className="col-span-5">Business</div>
              <div className="col-span-3 hidden sm:block">Details</div>
              <div className="col-span-2 hidden md:block">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filtered.map((item) => {
              const img = item.mainPhoto || (Array.isArray(item.photos) && item.photos[0]) || FALLBACK;
              return (
                <div
                  key={item._id}
                  className={`grid grid-cols-12 items-center gap-2 px-4 py-3.5 transition border-b last:border-b-0 ${rowHov} ${dark ? "border-white/[0.04]" : "border-slate-50"}`}
                >
                  {/* Name + image */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
                      <img src={img} alt={item.businessName} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${page}`}>{item.businessName}</p>
                      <p className={`truncate text-xs ${metaTx}`}>{item.owner?.email || "—"}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="col-span-3 hidden sm:block">
                    <div className={`flex flex-col gap-0.5 text-xs ${metaTx}`}>
                      <span className="flex items-center gap-1"><Tag size={10} className="opacity-60" />{item.category || "—"}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} className="opacity-60" />{item.city || "—"}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 hidden md:block">
                    {item.isApproved ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                        <ShieldCheck size={10} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEdit(item)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${dark ? "text-zinc-400 hover:bg-white/[0.06] hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => del(item._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          business={editing}
          dark={dark}
          onClose={() => setEdit(null)}
          onSaved={() => { setEdit(null); fetch_(); }}
        />
      )}
    </div>
  );
}