import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck, Inbox, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../services/socket";

// ── Time formatter ────────────────────────────────────────────────
function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString();
}

// ── Notification type config ──────────────────────────────────────
function getNotificationStyle(type) {
  switch (type) {
    case "appointment_created":
      return { dot: "bg-blue-500", accent: "text-blue-600", bg: "bg-blue-50/60", icon: "📅" };
    case "appointment_confirmed":
      return { dot: "bg-green-500", accent: "text-green-600", bg: "bg-green-50/60", icon: "✅" };
    case "appointment_cancelled":
      return { dot: "bg-red-500", accent: "text-red-500", bg: "bg-red-50/60", icon: "❌" };
    case "review_created":
      return { dot: "bg-yellow-400", accent: "text-yellow-500", bg: "bg-yellow-50/60", icon: "⭐" };
    case "review_reply":
      return { dot: "bg-purple-500", accent: "text-purple-600", bg: "bg-purple-50/60", icon: "💬" };
    case "appointment_reminder":
      return { dot: "bg-orange-400", accent: "text-orange-500", bg: "bg-orange-50/60", icon: "⏰" };
    default:
      return { dot: "bg-[#0a4abf]", accent: "text-[#0a4abf]", bg: "bg-blue-50/40", icon: "🔔" };
  }
}

// ── Component ─────────────────────────────────────────────────────
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Socket.io — real-time new notifications
  useEffect(() => {
    if (!token || !userId) return;

    socket.emit("register", userId);

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, [token, userId]);

  // Fetch only the unread count on mount, then poll slowly.
  // The full notification list is loaded only when the dropdown is opened.
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setUnreadCount(res.data?.count || 0);
      } catch (error) {
        if (error?.response?.status !== 429) {
          console.error("Notification unread count error:", error);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  // Load notifications only when the user opens the dropdown.
  useEffect(() => {
    if (!open || !token) return;

    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        if (error?.response?.status !== 429) {
          console.error("Notification fetch error:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, [open, token]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-all-read/all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all read failed:", error);
    }
  };

  return (
    <>
      <style>{`
        .notif-scroll::-webkit-scrollbar { width: 4px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .notif-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div className="relative" ref={ref}>

        {/* ── Bell button ── */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white text-[#0a4abf] transition hover:bg-blue-50"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </button>

        {/* ── Dropdown panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute right-0 top-full z-[9999] mt-3 w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-slate-900">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0a4abf] px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-medium text-[#0a4abf] transition hover:bg-blue-50"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="notif-scroll max-h-[380px] overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#0a4abf]" />
                    <p className="mt-2 text-[12px] text-slate-400">Loading…</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Inbox size={30} strokeWidth={1.3} className="mb-2 text-slate-300" />
                    <p className="text-[13px] font-medium text-slate-500">No notifications yet</p>
                    <p className="text-[11.5px] text-slate-300">You're all caught up!</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {notifications.map((n) => {
                      const style = getNotificationStyle(n.type);
                      return (
                        <li key={n._id}>
                          <button
                            onClick={() => !n.isRead && markAsRead(n._id)}
                            className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 ${
                              !n.isRead ? style.bg : ""
                            }`}
                          >
                            {/* Type icon */}
                            <span className="mt-0.5 shrink-0 text-[17px] leading-none">
                              {style.icon}
                            </span>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-[13px] leading-snug ${!n.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-600"}`}>
                                  {n.title}
                                </p>
                                <span className="mt-0.5 shrink-0 text-[10.5px] text-slate-400">
                                  {timeAgo(n.createdAt)}
                                </span>
                              </div>
                              {n.message && (
                                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
                                  {n.message}
                                </p>
                              )}
                            </div>

                            {/* Read/unread dot */}
                            <div className="mt-1.5 shrink-0">
                              {!n.isRead ? (
                                <span className={`block h-2 w-2 rounded-full ${style.dot}`} />
                              ) : (
                                <Check size={12} className="text-slate-300" />
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-slate-100 px-4 py-2.5">
                  <button className="w-full rounded-xl py-2 text-center text-[12.5px] font-medium text-[#0a4abf] transition hover:bg-blue-50">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}