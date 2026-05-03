import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  UserRound,
  XCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import {
  getBusinessAppointments,
  updateAppointmentStatus,
} from "../../services/businessAppointmentService";
import { DashboardThemeContext } from "../../layouts/BusinessLayout";

function normalizeStatus(status = "") {
  return String(status).trim().toLowerCase();
}

function formatStatusLabel(status = "") {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    case "no_show":
    case "noshow":
      return "No Show";
    default:
      return status || "Unknown";
  }
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeOnly(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return value;
}

function displayCustomer(appointment) {
  return (
    appointment?.user?.fullName ||
    appointment?.user?.name ||
    appointment?.userId?.fullName ||
    appointment?.userId?.name ||
    appointment?.customerName ||
    appointment?.clientName ||
    "Unknown Customer"
  );
}

function displayService(appointment) {
  return (
    appointment?.service?.name ||
    appointment?.serviceId?.name ||
    appointment?.serviceName ||
    "Unknown Service"
  );
}

function displayDate(appointment) {
  return (
    appointment?.date ||
    appointment?.appointmentDate ||
    appointment?.startTime ||
    appointment?.createdAt ||
    ""
  );
}

function displayTime(appointment) {
  return (
    appointment?.time ||
    appointment?.appointmentTime ||
    appointment?.slot ||
    formatTimeOnly(appointment?.startTime) ||
    "-"
  );
}

function displayNotes(appointment) {
  return appointment?.notes || appointment?.note || "No notes added";
}

function statusTone(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "pending") return "amber";
  if (normalized === "confirmed") return "blue";
  if (normalized === "completed") return "green";
  if (normalized === "cancelled" || normalized === "canceled") return "red";
  if (normalized === "no_show" || normalized === "noshow") return "red";

  return "slate";
}

function StatusBadge({ status, darkMode }) {
  const tone = statusTone(status);

  const light = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const dark = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    slate: "bg-white/[0.04] text-zinc-400 border-white/[0.06]",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
        darkMode ? dark[tone] : light[tone]
      }`}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

function StatCard({ item, index, darkMode }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className={`rounded-xl border p-5 transition hover:shadow-sm ${
        darkMode
          ? "border-white/[0.06] bg-[#18181b]"
          : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-medium ${
              darkMode ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            {item.title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            {item.value}
          </p>

          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-zinc-600" : "text-slate-400"
            }`}
          >
            {item.subtitle}
          </p>
        </div>

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${item.accent}18`, color: item.accent }}
        >
          <Icon size={17} />
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonAppointments({ darkMode }) {
  return (
    <div className="max-w-7xl space-y-5">
      <div
        className={`h-16 animate-pulse rounded-xl ${
          darkMode ? "bg-[#18181b]" : "bg-white"
        }`}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-32 animate-pulse rounded-xl ${
              darkMode ? "bg-[#18181b]" : "bg-white"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div
          className={`h-[560px] animate-pulse rounded-xl xl:col-span-7 ${
            darkMode ? "bg-[#18181b]" : "bg-white"
          }`}
        />
        <div
          className={`h-[560px] animate-pulse rounded-xl xl:col-span-5 ${
            darkMode ? "bg-[#18181b]" : "bg-white"
          }`}
        />
      </div>
    </div>
  );
}

export default function BusinessAppointments() {
  const { darkMode } = useContext(DashboardThemeContext);

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBusinessAppointments();
      const list = Array.isArray(data) ? data : data?.data || [];

      setAppointments(list);

      if (list.length && !selected) {
        setSelected(list[0]);
      }
    } catch (error) {
      console.error("Fetch business appointments error:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    if (filter !== "all") {
      list = list.filter(
        (appointment) =>
          normalizeStatus(appointment.status) === normalizeStatus(filter)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter((appointment) => {
        const customer = displayCustomer(appointment).toLowerCase();
        const service = displayService(appointment).toLowerCase();
        const status = String(appointment.status || "").toLowerCase();

        return customer.includes(q) || service.includes(q) || status.includes(q);
      });
    }

    return list;
  }, [appointments, filter, search]);

  useEffect(() => {
    if (!filteredAppointments.length) {
      setSelected(null);
      return;
    }

    const exists = filteredAppointments.some(
      (appointment) => appointment._id === selected?._id
    );

    if (!exists) {
      setSelected(filteredAppointments[0]);
    }
  }, [filteredAppointments, selected]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => normalizeStatus(a.status) === "pending")
        .length,
      confirmed: appointments.filter(
        (a) => normalizeStatus(a.status) === "confirmed"
      ).length,
      completed: appointments.filter(
        (a) => normalizeStatus(a.status) === "completed"
      ).length,
      cancelled: appointments.filter((a) => {
        const s = normalizeStatus(a.status);
        return s === "cancelled" || s === "canceled";
      }).length,
    };
  }, [appointments]);

  const handleSelect = (appointment) => {
    setSelected(appointment);
  };

  const handleStatusUpdate = async (status) => {
    if (!selected) return;

    try {
      setSaving(true);

      const res = await updateAppointmentStatus(selected._id, status);
      const updated = res?.data || res;

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === updated._id ? updated : appointment
        )
      );

      setSelected(updated);
    } catch (error) {
      console.error("Update appointment status error:", error);
    } finally {
      setSaving(false);
    }
  };

  const statItems = [
    {
      title: "Total",
      value: String(stats.total),
      subtitle: "All bookings",
      icon: CalendarDays,
      accent: "#6366f1",
    },
    {
      title: "Pending",
      value: String(stats.pending),
      subtitle: "Waiting confirmation",
      icon: Clock3,
      accent: "#f59e0b",
    },
    {
      title: "Confirmed",
      value: String(stats.confirmed),
      subtitle: "Approved bookings",
      icon: CheckCircle2,
      accent: "#2563eb",
    },
    {
      title: "Cancelled",
      value: String(stats.cancelled),
      subtitle: "Cancelled bookings",
      icon: XCircle,
      accent: "#ef4444",
    },
  ];

  if (loading) {
    return <SkeletonAppointments darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl">
        <div
          className={`rounded-xl border p-5 ${
            darkMode
              ? "border-red-500/20 bg-red-500/10"
              : "border-red-100 bg-red-50"
          }`}
        >
          <div
            className={`flex items-start gap-3 ${
              darkMode ? "text-red-300" : "text-red-700"
            }`}
          >
            <AlertCircle size={17} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Could not load appointments</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl space-y-5 ${
        darkMode ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Clean SaaS header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
              darkMode ? "text-zinc-500" : "text-slate-400"
            }`}
          >
            Bookings
          </p>

          <h1
            className={`mt-1 text-xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            Appointments
          </h1>

          <p
            className={`mt-0.5 text-sm ${
              darkMode ? "text-zinc-500" : "text-slate-400"
            }`}
          >
            Manage customer bookings, statuses, and appointment details.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item, index) => (
          <StatCard
            key={item.title}
            item={item}
            index={index}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* List */}
        <section
          className={`overflow-hidden rounded-xl border xl:col-span-7 ${
            darkMode
              ? "border-white/[0.06] bg-[#18181b]"
              : "border-slate-100 bg-white"
          }`}
        >
          <div
            className={`border-b px-4 py-3 ${
              darkMode ? "border-white/[0.06]" : "border-slate-100"
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2
                  className={`text-sm font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Appointment List
                </h2>
                <p
                  className={`text-xs ${
                    darkMode ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  {filteredAppointments.length} results
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative sm:w-64">
                  <Search
                    size={13}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-zinc-600" : "text-slate-400"
                    }`}
                  />

                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/[0.08] bg-[#111113] text-white placeholder:text-zinc-600 focus:border-indigo-500"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    }`}
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                    darkMode
                      ? "border-white/[0.08] bg-[#111113] text-white focus:border-indigo-500"
                      : "border-slate-200 bg-white text-slate-700 focus:border-indigo-400"
                  }`}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className={`divide-y ${
              darkMode ? "divide-white/[0.06]" : "divide-slate-100"
            }`}
          >
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const isActive = selected?._id === appointment._id;

                return (
                  <button
                    key={appointment._id}
                    onClick={() => handleSelect(appointment)}
                    className={`grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? darkMode
                          ? "bg-white/[0.05]"
                          : "bg-indigo-50/70"
                        : darkMode
                        ? "hover:bg-white/[0.03]"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="col-span-7 flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          darkMode
                            ? "bg-white/[0.06] text-zinc-300"
                            : "bg-slate-50 text-indigo-600"
                        }`}
                      >
                        <UserRound size={15} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {displayCustomer(appointment)}
                        </p>

                        <p
                          className={`truncate text-xs ${
                            darkMode ? "text-zinc-500" : "text-slate-400"
                          }`}
                        >
                          {displayService(appointment)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`col-span-3 hidden text-xs sm:block ${
                        darkMode ? "text-zinc-500" : "text-slate-400"
                      }`}
                    >
                      {formatDate(displayDate(appointment))}
                      <br />
                      {displayTime(appointment)}
                    </div>

                    <div className="col-span-5 flex justify-end sm:col-span-2">
                      <StatusBadge
                        status={appointment.status}
                        darkMode={darkMode}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div
                className={`px-4 py-12 text-center text-sm ${
                  darkMode ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                No appointments found.
              </div>
            )}
          </div>
        </section>

        {/* Details */}
        <section
          className={`rounded-xl border xl:col-span-5 ${
            darkMode
              ? "border-white/[0.06] bg-[#18181b]"
              : "border-slate-100 bg-white"
          }`}
        >
          <div
            className={`border-b px-4 py-3 ${
              darkMode ? "border-white/[0.06]" : "border-slate-100"
            }`}
          >
            <h2
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Appointment Details
            </h2>

            <p
              className={`text-xs ${
                darkMode ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              Review booking information and update status
            </p>
          </div>

          {selected ? (
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {displayCustomer(selected)}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode ? "text-zinc-500" : "text-slate-400"
                    }`}
                  >
                    {displayService(selected)}
                  </p>
                </div>

                <StatusBadge status={selected.status} darkMode={darkMode} />
              </div>

              <div
                className={`mt-6 grid grid-cols-2 gap-3 text-sm ${
                  darkMode ? "text-zinc-400" : "text-slate-500"
                }`}
              >
                <div
                  className={`rounded-lg border p-3 ${
                    darkMode
                      ? "border-white/[0.06] bg-[#111113]"
                      : "border-slate-100 bg-slate-50/60"
                  }`}
                >
                  <p className="text-xs opacity-70">Date</p>
                  <p
                    className={`mt-1 font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {formatDate(displayDate(selected))}
                  </p>
                </div>

                <div
                  className={`rounded-lg border p-3 ${
                    darkMode
                      ? "border-white/[0.06] bg-[#111113]"
                      : "border-slate-100 bg-slate-50/60"
                  }`}
                >
                  <p className="text-xs opacity-70">Time</p>
                  <p
                    className={`mt-1 font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {displayTime(selected)}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 rounded-lg border p-4 ${
                  darkMode
                    ? "border-white/[0.06] bg-[#111113]"
                    : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  Notes
                </p>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    darkMode ? "text-zinc-300" : "text-slate-600"
                  }`}
                >
                  {displayNotes(selected)}
                </p>
              </div>

              <div className="mt-6">
                <p
                  className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  Update Status
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Confirm", value: "confirmed" },
                    { label: "Complete", value: "completed" },
                    { label: "Cancel", value: "cancelled" },
                    { label: "No Show", value: "no_show" },
                  ].map((action) => (
                    <button
                      key={action.value}
                      onClick={() => handleStatusUpdate(action.value)}
                      disabled={saving}
                      className={`inline-flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        darkMode
                          ? "border-white/[0.08] bg-[#111113] text-zinc-300 hover:bg-white/[0.05]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {saving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        action.label
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`px-5 py-16 text-center text-sm ${
                darkMode ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              Select an appointment to view details.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}