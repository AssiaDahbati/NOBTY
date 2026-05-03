import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck2,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  BriefcaseBusiness,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
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
    default:
      return status || "Unknown";
  }
}

function getStatusClass(status, darkMode = false) {
  const normalized = normalizeStatus(status);

  if (darkMode) {
    switch (normalized) {
      case "pending":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "cancelled":
      case "canceled":
        return "bg-rose-500/10 text-rose-300 border-rose-500/20";
      default:
        return "bg-white/[0.04] text-zinc-400 border-white/[0.06]";
    }
  }

  switch (normalized) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "cancelled":
    case "canceled":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
}

function formatDisplayDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayTime(value) {
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

function isToday(dateValue) {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getCustomerName(appointment) {
  return (
    appointment?.user?.fullName ||
    appointment?.user?.name ||
    appointment?.customerName ||
    appointment?.clientName ||
    "Unknown Customer"
  );
}

function getServiceName(appointment) {
  return appointment?.service?.name || appointment?.serviceName || "Unknown Service";
}

function getAppointmentDateValue(appointment) {
  return appointment?.date || appointment?.appointmentDate || appointment?.createdAt;
}

function getAppointmentTimeValue(appointment) {
  return appointment?.time || appointment?.appointmentTime || "";
}

function getMostBookedService(appointments) {
  if (!appointments.length) return "No bookings yet";

  const counts = {};

  appointments.forEach((appointment) => {
    const serviceName = getServiceName(appointment);
    counts[serviceName] = (counts[serviceName] || 0) + 1;
  });

  let topService = "No bookings yet";
  let topCount = 0;

  Object.entries(counts).forEach(([serviceName, count]) => {
    if (count > topCount) {
      topService = serviceName;
      topCount = count;
    }
  });

  return topService;
}

function getQueueLoadLabel(todayAppointmentsCount) {
  if (todayAppointmentsCount <= 3) return "Low";
  if (todayAppointmentsCount <= 8) return "Moderate";
  return "High";
}

function getAvailabilityLabel(todayAppointmentsCount, queueCapacity) {
  if (!queueCapacity || queueCapacity <= 0) return "Available";
  if (todayAppointmentsCount >= queueCapacity) return "Busy";
  if (todayAppointmentsCount >= Math.ceil(queueCapacity * 0.7)) return "Limited";
  return "Available";
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getLast7DaysChartData(appointments) {
  const today = startOfDay(new Date());
  const days = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    days.push({
      date: day,
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      fullLabel: day.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
      }),
      count: 0,
    });
  }

  appointments.forEach((appointment) => {
    const raw = getAppointmentDateValue(appointment);
    if (!raw) return;

    const appointmentDate = startOfDay(new Date(raw));
    if (Number.isNaN(appointmentDate.getTime())) return;

    const match = days.find((day) => isSameDay(day.date, appointmentDate));
    if (match) match.count += 1;
  });

  return days;
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
        darkMode ? "border-white/[0.06] bg-[#18181b]" : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
            {item.title}
          </p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
            {item.value}
          </p>
          <p className={`mt-1 text-xs ${darkMode ? "text-zinc-600" : "text-slate-400"}`}>
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

function OverviewChart({ data, darkMode }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <section className={`rounded-xl border p-5 ${darkMode ? "border-white/[0.06] bg-[#18181b]" : "border-slate-100 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Last 7 Days Overview
          </h2>
          <p className={`mt-0.5 text-xs ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
            Appointment activity across the last week
          </p>
        </div>

        <div className={darkMode ? "rounded-lg bg-white/[0.06] p-2 text-zinc-300" : "rounded-lg bg-slate-50 p-2 text-indigo-600"}>
          <TrendingUp size={15} />
        </div>
      </div>

      <div className="mt-6 flex h-56 items-end gap-3">
        {data.map((item, index) => {
          const height = `${Math.max((item.count / max) * 100, item.count > 0 ? 14 : 6)}%`;

          return (
            <div key={item.fullLabel} className="flex flex-1 flex-col items-center">
              <div className={`mb-2 text-[11px] font-semibold ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                {item.count}
              </div>

              <div className="flex h-40 w-full items-end">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height, opacity: 1 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="w-full rounded-t-lg bg-indigo-600"
                  title={`${item.fullLabel}: ${item.count} appointments`}
                />
              </div>

              <div className={`mt-2 text-[11px] font-medium ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SkeletonOverview({ darkMode }) {
  return (
    <div className="max-w-7xl space-y-5">
      <div className={`h-16 animate-pulse rounded-xl ${darkMode ? "bg-[#18181b]" : "bg-white"}`} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-32 animate-pulse rounded-xl ${darkMode ? "bg-[#18181b]" : "bg-white"}`} />
        ))}
      </div>
      <div className={`h-72 animate-pulse rounded-xl ${darkMode ? "bg-[#18181b]" : "bg-white"}`} />
    </div>
  );
}

export default function BusinessOverview() {
  const { darkMode } = useContext(DashboardThemeContext);

  const [business, setBusiness] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const businessRes = await api.get("/businesses/my-business", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const businessData = businessRes.data?.business || businessRes.data;

        if (!businessData?._id) {
          throw new Error("Business not found for this account.");
        }

        setBusiness(businessData);
        setServicesCount(Array.isArray(businessData?.services) ? businessData.services.length : 0);

        const appointmentsRes = await api.get(`/appointments/business/${businessData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointmentsData =
          appointmentsRes.data?.data ||
          appointmentsRes.data?.appointments ||
          appointmentsRes.data ||
          [];

        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (err) {
        console.error("Failed to load business overview:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load business overview."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const derived = useMemo(() => {
    const todayAppointments = appointments.filter((appointment) =>
      isToday(getAppointmentDateValue(appointment))
    );

    const pendingCount = appointments.filter(
      (appointment) => normalizeStatus(appointment?.status) === "pending"
    ).length;

    const completedTodayCount = todayAppointments.filter(
      (appointment) => normalizeStatus(appointment?.status) === "completed"
    ).length;

    const cancelledCount = appointments.filter((appointment) => {
      const status = normalizeStatus(appointment?.status);
      return status === "cancelled" || status === "canceled";
    }).length;

    const recentAppointments = [...appointments]
      .sort((a, b) => {
        const aDate = new Date(getAppointmentDateValue(a));
        const bDate = new Date(getAppointmentDateValue(b));
        return bDate - aDate;
      })
      .slice(0, 6);

    const todayCount = todayAppointments.length;

    return {
      todayCount,
      pendingCount,
      completedTodayCount,
      cancelledCount,
      recentAppointments,
      mostBookedService: getMostBookedService(appointments),
      queueLoad: getQueueLoadLabel(todayCount),
      availability: getAvailabilityLabel(todayCount, business?.queueCapacity || 0),
      chartData: getLast7DaysChartData(appointments),
    };
  }, [appointments, business]);

  const stats = [
    {
      title: "Today",
      value: String(derived.todayCount),
      subtitle: "Scheduled appointments",
      icon: CalendarCheck2,
      accent: "#6366f1",
    },
    {
      title: "Pending",
      value: String(derived.pendingCount),
      subtitle: "Waiting confirmation",
      icon: Clock3,
      accent: "#f59e0b",
    },
    {
      title: "Completed",
      value: String(derived.completedTodayCount),
      subtitle: "Finished today",
      icon: CheckCircle2,
      accent: "#10b981",
    },
    {
      title: "Cancelled",
      value: String(derived.cancelledCount),
      subtitle: "Cancelled bookings",
      icon: XCircle,
      accent: "#ef4444",
    },
  ];

  if (loading) {
    return <SkeletonOverview darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl">
        <div className={`rounded-xl border p-5 ${darkMode ? "border-red-500/20 bg-red-500/10" : "border-red-100 bg-red-50"}`}>
          <div className={`flex items-start gap-3 ${darkMode ? "text-red-300" : "text-red-700"}`}>
            <AlertCircle size={17} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Could not load overview</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl space-y-5 ${darkMode ? "text-white" : "text-slate-900"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
            Business
          </p>
          <h1 className={`mt-1 text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
            Dashboard
          </h1>
          <p className={`mt-0.5 text-sm ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
            Overview for {business?.businessName || "your business"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/appointments"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Appointments
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/dashboard/services"
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              darkMode
                ? "border-white/[0.08] bg-[#18181b] text-zinc-300 hover:bg-white/[0.04]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Services
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <StatCard key={item.title} item={item} index={index} darkMode={darkMode} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <OverviewChart data={derived.chartData} darkMode={darkMode} />
        </div>

        <div className="space-y-5 xl:col-span-4">
          <section className={`rounded-xl border p-5 ${darkMode ? "border-white/[0.06] bg-[#18181b]" : "border-slate-100 bg-white"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Today’s Summary
                </h2>
                <p className={`mt-0.5 text-xs ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                  Operational snapshot
                </p>
              </div>

              <div className={darkMode ? "rounded-lg bg-white/[0.06] p-2 text-zinc-300" : "rounded-lg bg-slate-50 p-2 text-indigo-600"}>
                <Activity size={15} />
              </div>
            </div>

            <div className={`mt-5 space-y-3 text-sm ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
              <div className="flex justify-between gap-4">
                <span>Most booked</span>
                <span className={`text-right font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {derived.mostBookedService}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Availability</span>
                <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {derived.availability}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Queue load</span>
                <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {derived.queueLoad}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Total services</span>
                <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {servicesCount}
                </span>
              </div>
            </div>
          </section>

          <section className={`rounded-xl border p-5 ${darkMode ? "border-white/[0.06] bg-[#18181b]" : "border-slate-100 bg-white"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Quick Actions
                </h2>
                <p className={`mt-0.5 text-xs ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                  Manage faster
                </p>
              </div>

              <div className={darkMode ? "rounded-lg bg-white/[0.06] p-2 text-zinc-300" : "rounded-lg bg-slate-50 p-2 text-indigo-600"}>
                <BriefcaseBusiness size={15} />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {[
                { to: "/dashboard/services", label: "Add or edit services" },
                { to: "/dashboard/schedule", label: "Update schedule" },
                { to: "/dashboard/appointments", label: "Manage bookings" },
                { to: "/dashboard/settings", label: "Edit profile" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${
                    darkMode
                      ? "border-white/[0.06] text-zinc-300 hover:bg-white/[0.04]"
                      : "border-slate-100 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {action.label}
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className={`overflow-hidden rounded-xl border ${darkMode ? "border-white/[0.06] bg-[#18181b]" : "border-slate-100 bg-white"}`}>
        <div className={`border-b px-4 py-3 ${darkMode ? "border-white/[0.06]" : "border-slate-100"}`}>
          <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Recent Appointments
          </h2>
          <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
            Latest booking activity from your business
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={darkMode ? "bg-white/[0.02]" : "bg-slate-50/60"}>
              <tr className={`text-left text-[11px] font-semibold uppercase tracking-wider ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Service</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>

            <tbody>
              {derived.recentAppointments.length > 0 ? (
                derived.recentAppointments.map((appointment) => (
                  <tr
                    key={appointment._id || appointment.id}
                    className={`border-t transition ${
                      darkMode
                        ? "border-white/[0.06] hover:bg-white/[0.03]"
                        : "border-slate-100 hover:bg-slate-50/60"
                    }`}
                  >
                    <td className={`px-4 py-3 text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {getCustomerName(appointment)}
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                      {getServiceName(appointment)}
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                      {formatDisplayDate(getAppointmentDateValue(appointment))}
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                      {formatDisplayTime(getAppointmentTimeValue(appointment))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(
                          appointment.status,
                          darkMode
                        )}`}
                      >
                        {formatStatusLabel(appointment.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-10 text-center text-sm ${darkMode ? "text-zinc-500" : "text-slate-400"}`}
                  >
                    No appointments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}