import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line,
} from "recharts";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  AlertTriangle, DollarSign, TrendingUp,
} from "lucide-react";

const monthly = [
  { month: "Jan", bookings: 18, revenue: 1200 },
  { month: "Feb", bookings: 26, revenue: 2100 },
  { month: "Mar", bookings: 34, revenue: 3300 },
  { month: "Apr", bookings: 29, revenue: 2800 },
  { month: "May", bookings: 42, revenue: 4600 },
  { month: "Jun", bookings: 51, revenue: 5800 },
];

const topServices = [
  { name: "Credit & Financing Advisory", bookings: 28 },
  { name: "International Transfers", bookings: 21 },
  { name: "Account Opening Support", bookings: 17 },
  { name: "Business Banking Consultation", bookings: 12 },
];

const stats = {
  total: 143,
  pending: 9,
  completed: 104,
  cancelled: 7,
  no_show: 3,
  revenue: 21800,
};

export default function BusinessAnalytics() {
  const cards = [
    { title: "Total Appointments", value: stats.total, icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { title: "Completed", value: stats.completed, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { title: "Cancelled", value: stats.cancelled, icon: XCircle, color: "bg-red-50 text-red-600" },
    { title: "No Show", value: stats.no_show, icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
    { title: "Revenue", value: `${stats.revenue} MAD`, icon: DollarSign, color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          Business Analytics
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Performance overview
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Demo analytics preview showing bookings, revenue, and service demand.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {card.value}
                  </h2>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Monthly bookings</h2>
          <p className="mb-6 text-sm text-slate-500">Appointments by month.</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0a4abf" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Revenue trend</h2>
          <p className="mb-6 text-sm text-slate-500">Estimated revenue growth.</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Top services</h2>
          <div className="mt-6 space-y-4">
            {topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-800">{index + 1}. {service.name}</p>
                  <p className="text-sm text-slate-500">{service.bookings} bookings</p>
                </div>
                <TrendingUp size={20} className="text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Business insight</h2>
          <div className="mt-5 rounded-3xl bg-blue-50 p-5">
            <p className="text-sm leading-7 text-slate-700">
              Booking activity is increasing steadily. The strongest demand appears in May and June,
              while completed appointments represent most of the business performance.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Completion</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-600">73%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Cancellation</p>
              <p className="mt-2 text-2xl font-semibold text-red-500">5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}