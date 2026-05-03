import { useEffect, useMemo, useState } from "react";
import {
  ShieldAlert, Search, CheckCircle2, XCircle, Clock,
  Calendar, User, Mail, FileText, StickyNote,
} from "lucide-react";
import { getAllAppeals, updateAppealStatus } from "../../services/appealService";
import { useTheme } from "../../layouts/AdminLayout";

const FILTERS = ["all", "pending", "approved", "rejected"];

function StatusBadge({ status }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
        <CheckCircle2 size={10} /> Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 border border-red-100">
        <XCircle size={10} /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100">
      <Clock size={10} /> Pending
    </span>
  );
}

export default function AdminAppealsPage() {
  const { dark } = useTheme();
  const [appeals, setAppeals]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null); // "approved" | "rejected" | null
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");

  const fetch_ = async () => {
    setLoading(true);
    try {
      const data = await getAllAppeals();
      setAppeals(data);
      if (data.length && !selected) {
        setSelected(data[0]);
        setAdminNote(data[0].adminNote || "");
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = useMemo(() => {
    let list = [...appeals];
    if (filter !== "all") list = list.filter((a) => a.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        [a.name, a.email, a.reason, a.details].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return list;
  }, [appeals, filter, search]);

  useEffect(() => {
    if (!filtered.length) { setSelected(null); return; }
    const exists = filtered.some((a) => a._id === selected?._id);
    if (!exists) { setSelected(filtered[0]); setAdminNote(filtered[0].adminNote || ""); }
  }, [filtered]);

  const stats = useMemo(() => ({
    total:    appeals.length,
    pending:  appeals.filter((a) => a.status === "pending").length,
    approved: appeals.filter((a) => a.status === "approved").length,
    rejected: appeals.filter((a) => a.status === "rejected").length,
  }), [appeals]);

  const handleSelect = (a) => { setSelected(a); setAdminNote(a.adminNote || ""); };

  const handleDecision = async (status) => {
    if (!selected) return;
    setSaving(status);
    try {
      const res = await updateAppealStatus(selected._id, status, adminNote);
      const updated = res.data;
      setAppeals((p) => p.map((a) => a._id === updated._id ? updated : a));
      setSelected(updated);
      setAdminNote(updated.adminNote || "");
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
  const initials = (name) => name ? name.charAt(0).toUpperCase() : "?";

  /* ── tokens ── */
  const page     = dark ? "text-white"           : "text-slate-900";
  const sub      = dark ? "text-zinc-500"         : "text-slate-400";
  const card     = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const innerBg  = dark ? "bg-[#111113]"          : "bg-[#f6f7f9]";
  const rowHov   = dark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const rowAct   = dark ? "bg-white/[0.05]"       : "bg-indigo-50/60";
  const metaTx   = dark ? "text-zinc-500"         : "text-slate-500";
  const divB     = dark ? "border-white/[0.06]"   : "border-slate-100";
  const hdrRow   = dark ? "bg-white/[0.02] text-zinc-500" : "bg-slate-50/60 text-slate-400";
  const searchB  = dark
    ? "bg-[#111113] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white";
  const noteB    = dark
    ? "bg-[#111113] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white";
  const detailSec = dark ? "bg-white/[0.03] border-white/[0.06]" : "bg-slate-50/60 border-slate-100";

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${page}`}>Blacklist Appeals</h1>
          <p className={`mt-0.5 text-sm ${sub}`}>Review and manage submitted appeals</p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { l: "Total",    v: stats.total,    col: dark ? "bg-white/[0.06] text-zinc-300" : "bg-slate-100 text-slate-600" },
            { l: "Pending",  v: stats.pending,  col: "bg-amber-50 text-amber-700 border border-amber-100" },
            { l: "Approved", v: stats.approved, col: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
            { l: "Rejected", v: stats.rejected, col: "bg-red-50 text-red-700 border border-red-100" },
          ].map((s) => (
            <div key={s.l} className={`rounded-lg px-3 py-1.5 text-center ${s.col}`}>
              <p className="text-base font-bold leading-none">{s.v}</p>
              <p className="text-[10px] mt-0.5 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
          <input
            type="text"
            placeholder="Search name, email, reason…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition ${searchB}`}
          />
        </div>

        <div className={`flex rounded-lg border p-0.5 ${dark ? "border-white/[0.08] bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : `${metaTx} hover:opacity-80`
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="flex flex-col min-h-[600px] xl:flex-row">

          {/* Left list */}
          <div className={`w-full xl:w-[380px] shrink-0 border-b xl:border-b-0 xl:border-r ${divB} flex flex-col`}>

            {/* Column headers */}
            <div className={`grid grid-cols-12 border-b ${divB} px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${hdrRow}`}>
              <div className="col-span-6">Applicant</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3 text-right">Date</div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex min-h-52 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-center">
                  <ShieldAlert size={24} className={sub} />
                  <p className={`text-sm font-medium ${page}`}>No appeals found</p>
                </div>
              ) : (
                filtered.map((appeal) => {
                  const isAct = selected?._id === appeal._id;
                  return (
                    <button
                      key={appeal._id}
                      onClick={() => handleSelect(appeal)}
                      className={`
                        relative w-full grid grid-cols-12 items-center border-b px-4 py-3 text-left transition last:border-b-0
                        ${dark ? "border-white/[0.04]" : "border-slate-50"}
                        ${isAct ? rowAct : rowHov}
                      `}
                    >
                      {isAct && (
                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-500" />
                      )}

                      <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                          {initials(appeal.name)}
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate text-xs font-semibold ${page}`}>{appeal.name}</p>
                          <p className={`truncate text-[11px] ${metaTx}`}>{appeal.email}</p>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <StatusBadge status={appeal.status} />
                      </div>

                      <div className={`col-span-3 text-right text-[11px] ${metaTx}`}>
                        {fmt(appeal.createdAt)}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right detail */}
          <div className={`flex-1 overflow-y-auto p-5 ${innerBg}`}>
            {!selected ? (
              <div className={`flex h-full min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center ${dark ? "border-white/10" : "border-slate-200"}`}>
                <ShieldAlert size={26} className={sub} />
                <p className={`text-sm font-medium ${sub}`}>Select an appeal to review</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-lg">

                {/* Sender info */}
                <div className={`rounded-xl border p-4 flex items-center gap-3 ${card}`}>
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
                    {initials(selected.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${page}`}>{selected.name}</p>
                    <p className={`text-xs ${metaTx}`}>{selected.email}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Metadata row */}
                <div className={`rounded-xl border p-4 grid grid-cols-2 gap-3 ${card}`}>
                  {[
                    { icon: Calendar, label: "Submitted",  val: fmt(selected.createdAt) },
                    { icon: Calendar, label: "Reviewed",   val: selected.reviewedAt ? fmt(selected.reviewedAt) : "Not yet" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${metaTx}`}>
                        {label}
                      </p>
                      <p className={`text-xs font-medium flex items-center gap-1 ${page}`}>
                        <Icon size={11} className="opacity-50" /> {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reason */}
                <div className={`rounded-xl border p-4 ${card}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${metaTx}`}>
                    Reason
                  </p>
                  <p className={`text-sm font-medium ${page}`}>{selected.reason}</p>
                </div>

                {/* Details */}
                {selected.details && (
                  <div className={`rounded-xl border p-4 ${card}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${metaTx}`}>
                      Details
                    </p>
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                      {selected.details}
                    </p>
                  </div>
                )}

                {/* Saved note (read-only) */}
                {selected.adminNote && (
                  <div className={`rounded-xl border p-4 ${dark ? "border-indigo-900/50 bg-indigo-950/30" : "border-indigo-100 bg-indigo-50"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 mb-2">Saved Note</p>
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${dark ? "text-indigo-200" : "text-indigo-900"}`}>
                      {selected.adminNote}
                    </p>
                  </div>
                )}

                {/* Admin note + actions */}
                <div className={`rounded-xl border p-4 ${card}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${metaTx}`}>
                    Admin Note
                  </p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={4}
                    placeholder="Write an internal or decision note…"
                    className={`w-full rounded-lg border px-3.5 py-3 text-sm outline-none transition resize-none ${noteB}`}
                  />

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleDecision("approved")}
                      disabled={!!saving}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                    >
                      <CheckCircle2 size={13} />
                      {saving === "approved" ? "Saving…" : "Approve"}
                    </button>
                    <button
                      onClick={() => handleDecision("rejected")}
                      disabled={!!saving}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
                    >
                      <XCircle size={13} />
                      {saving === "rejected" ? "Saving…" : "Reject"}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}