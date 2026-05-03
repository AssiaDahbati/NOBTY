import React from "react";
import {
  CalendarCheck2,
  Clock3,
  Mail,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Upcoming",
    value: "2",
    subtitle: "Next visits",
    icon: CalendarCheck2,
    accent: "#6366f1",
  },
  {
    title: "Pending",
    value: "1",
    subtitle: "Needs attention",
    icon: Clock3,
    accent: "#f59e0b",
  },
  {
    title: "Messages",
    value: "1",
    subtitle: "Unread replies",
    icon: Mail,
    accent: "#1A52CC",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    business: "Elegant Salon",
    service: "Haircut & Styling",
    date: "21 Mar 2026",
    time: "10:30 AM",
    status: "Confirmed",
    city: "Casablanca",
  },
  {
    id: 2,
    business: "Glow Beauty Spa",
    service: "Facial Treatment",
    date: "23 Mar 2026",
    time: "02:00 PM",
    status: "Pending",
    city: "Rabat",
  },
];

const recentActivity = [
  "Your booking with Elegant Salon has been confirmed.",
  "You received a new admin reply in Messages.",
  "Your appointment request at Glow Beauty Spa is pending.",
];

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="relative rounded-xl border border-slate-100 bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

export default function UserOverview() {
  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Account summary and quick actions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="rounded-xl border border-slate-100 bg-white xl:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Upcoming Appointments
              </h2>
              <p className="text-xs text-slate-400">
                Your next confirmed and pending bookings
              </p>
            </div>

            <Link
              to="/account/appointments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              See all
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="grid grid-cols-12 items-center gap-3 px-4 py-3 transition hover:bg-slate-50/60"
              >
                <div className="col-span-6 flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Building2 size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {appointment.business}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {appointment.service}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 hidden text-xs text-slate-500 sm:block">
                  {appointment.date}
                  <br />
                  {appointment.time}
                </div>

                <div className="col-span-3 flex justify-end">
                  <StatusBadge status={appointment.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white xl:col-span-4">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Activity
            </h2>
            <p className="text-xs text-slate-400">
              Latest updates from your account
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3 px-4 py-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <p className="text-sm leading-6 text-slate-600">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Ready to book your next service?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Browse trusted providers and reserve your appointment.
            </p>
          </div>

          <Link
            to="/businesses"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}