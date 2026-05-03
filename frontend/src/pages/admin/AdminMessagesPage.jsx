import { useEffect, useMemo, useState } from "react";
import { Search, Send, MailOpen, Mail, Clock, CheckCheck } from "lucide-react";
import {
  getAllMessages, markMessageAsRead, replyToMessage,
} from "../../services/messageService";
import { useTheme } from "../../layouts/AdminLayout";

const FILTERS = ["all", "unread", "replied", "pending"];

function StatusPill({ msg }) {
  if (!msg.isRead) return (
    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-100">New</span>
  );
  if (msg.adminReply) return (
    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">Replied</span>
  );
  return (
    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100">Pending</span>
  );
}

export default function AdminMessagesPage() {
  const { dark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState("");
  const [loading, setLoad]      = useState(true);
  const [sending, setSend]      = useState(false);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");

  const fetch_ = async () => {
    setLoad(true);
    try {
      const data = await getAllMessages();
      setMessages(data);
      if (data.length && !selected) { setSelected(data[0]); setReply(data[0].adminReply || ""); }
    } catch (e) { console.error(e); }
    finally { setLoad(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    setReply(msg.adminReply || "");
    if (!msg.isRead) {
      try {
        await markMessageAsRead(msg._id);
        setMessages((p) => p.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
        setSelected((p) => p ? { ...p, isRead: true } : p);
      } catch (e) { console.error(e); }
    }
  };

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;
    setSend(true);
    try {
      const res = await replyToMessage(selected._id, reply.trim());
      const updated = res.data;
      setMessages((p) => p.map((m) => m._id === updated._id ? updated : m));
      setSelected(updated);
      setReply(updated.adminReply || "");
    } catch (e) { console.error(e); }
    finally { setSend(false); }
  };

  const filtered = useMemo(() => {
    let list = [...messages];
    if (filter === "unread")  list = list.filter((m) => !m.isRead);
    if (filter === "replied") list = list.filter((m) =>  m.adminReply);
    if (filter === "pending") list = list.filter((m) => !m.adminReply);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) =>
        [m.name, m.email, m.subject, m.message].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, search]);

  const stats = useMemo(() => ({
    total:   messages.length,
    unread:  messages.filter((m) => !m.isRead).length,
    replied: messages.filter((m) =>  m.adminReply).length,
    pending: messages.filter((m) => !m.adminReply).length,
  }), [messages]);

  const initials = (name) => name ? name.charAt(0).toUpperCase() : "?";
  const fmt      = (d) => d ? new Date(d).toLocaleDateString() : "";

  /* tokens */
  const page    = dark ? "text-white"         : "text-slate-900";
  const sub     = dark ? "text-zinc-500"      : "text-slate-400";
  const card    = dark ? "bg-[#18181b] border-white/[0.06]" : "bg-white border-slate-100";
  const innerBg = dark ? "bg-[#111113]"       : "bg-[#f6f7f9]";
  const rowHov  = dark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const rowAct  = dark ? "bg-white/[0.05]"    : "bg-indigo-50/70";
  const metaTx  = dark ? "text-zinc-500"      : "text-slate-500";
  const searchB = dark
    ? "bg-[#111113] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white";
  const textareaB = dark
    ? "bg-[#111113] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white";
  const divB    = dark ? "border-white/[0.06]" : "border-slate-100";

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${page}`}>Messages</h1>
          <p className={`mt-0.5 text-sm ${sub}`}>Manage user contact messages and admin replies</p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { l: "Total",   v: stats.total,   col: dark ? "bg-white/[0.06] text-zinc-300" : "bg-slate-100 text-slate-600" },
            { l: "Unread",  v: stats.unread,  col: "bg-blue-50 text-blue-700 border border-blue-100" },
            { l: "Pending", v: stats.pending, col: "bg-amber-50 text-amber-700 border border-amber-100" },
          ].map((s) => (
            <div key={s.l} className={`rounded-lg px-3 py-1.5 text-center ${s.col}`}>
              <p className="text-base font-bold leading-none">{s.v}</p>
              <p className="text-[10px] mt-0.5 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        {/* Top bar inside panel */}
        <div className={`flex flex-col gap-3 border-b ${divB} px-4 py-3 sm:flex-row sm:items-center`}>
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
            <input
              type="text"
              placeholder="Search messages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none transition ${searchB}`}
            />
          </div>

          <div className={`flex rounded-lg border ${dark ? "border-white/[0.08] bg-white/[0.03]" : "border-slate-200 bg-slate-50"} p-0.5`}>
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

        <div className="flex min-h-[540px] flex-col xl:flex-row">

          {/* Left — message list */}
          <div className={`flex-shrink-0 w-full xl:w-[360px] border-b xl:border-b-0 xl:border-r ${divB} overflow-y-auto`}>
            {loading ? (
              <div className="flex h-full min-h-52 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 p-8 text-center">
                <Mail size={24} className={sub} />
                <p className={`text-sm font-medium ${page}`}>No messages</p>
              </div>
            ) : (
              filtered.map((msg) => {
                const isAct = selected?._id === msg._id;
                return (
                  <button
                    key={msg._id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left border-b ${divB} px-4 py-3 transition last:border-b-0 ${isAct ? rowAct : rowHov}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white">
                        {initials(msg.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={`truncate text-xs font-semibold ${page}`}>{msg.name || "Unknown"}</p>
                          <StatusPill msg={msg} />
                        </div>
                        <p className={`truncate text-xs font-medium ${metaTx}`}>{msg.subject}</p>
                        <p className={`truncate text-[11px] mt-0.5 ${sub}`}>{msg.message}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right — detail */}
          <div className={`flex-1 overflow-y-auto p-5 ${innerBg}`}>
            {!selected ? (
              <div className={`flex h-full min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed ${dark ? "border-white/10 text-zinc-700" : "border-slate-200 text-slate-300"}`}>
                <MailOpen size={28} />
                <p className="text-sm font-medium">Select a message to view</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-xl">

                {/* Sender card */}
                <div className={`rounded-xl border p-4 flex items-center gap-3 ${card}`}>
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
                    {initials(selected.name)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${page}`}>{selected.name || "Unknown"}</p>
                    <p className={`text-xs ${metaTx}`}>{selected.email}</p>
                  </div>
                  <div className="ml-auto">
                    <StatusPill msg={selected} />
                  </div>
                </div>

                {/* Subject */}
                <div className={`rounded-xl border p-4 ${card}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${metaTx}`}>Subject</p>
                  <p className={`text-sm font-semibold ${page}`}>{selected.subject}</p>
                </div>

                {/* Message */}
                <div className={`rounded-xl border p-4 ${card}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${metaTx}`}>Message</p>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                    {selected.message}
                  </p>
                  <p className={`mt-3 text-[11px] ${sub}`}>{fmt(selected.createdAt)}</p>
                </div>

                {/* Previous reply */}
                {selected.adminReply && (
                  <div className={`rounded-xl border p-4 ${dark ? "border-emerald-900/50 bg-emerald-950/30" : "border-emerald-100 bg-emerald-50"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-2">Your reply</p>
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${dark ? "text-emerald-300" : "text-emerald-800"}`}>
                      {selected.adminReply}
                    </p>
                    {selected.repliedAt && (
                      <p className={`mt-2 text-[11px] ${sub}`}>{fmt(selected.repliedAt)}</p>
                    )}
                  </div>
                )}

                {/* Reply box */}
                <div className={`rounded-xl border p-4 ${card}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${metaTx}`}>
                    {selected.adminReply ? "Update reply" : "Write reply"}
                  </p>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={5}
                    placeholder="Type your reply…"
                    className={`w-full rounded-lg border px-3.5 py-3 text-sm outline-none transition resize-none ${textareaB}`}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <p className={`text-[11px] ${sub}`}>Keep responses clear and professional.</p>
                    <button
                      onClick={handleReply}
                      disabled={sending || !reply.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
                    >
                      <Send size={12} />
                      {sending ? "Sending…" : selected.adminReply ? "Update" : "Send"}
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