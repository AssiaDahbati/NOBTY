import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Building2,
  Search,
  MessageSquarePlus,
} from "lucide-react";
import {
  cancelMyAppointment,
  getMyAppointments,
} from "../../services/userAppointmentService";
import ReviewForm from "../../components/reviews/ReviewForm";

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);

      if (data.length && !selected) {
        setSelected(data[0]);
      }
    } catch (error) {
      console.error("Fetch user appointments error:", error);
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
          (appointment.status || "").toLowerCase() === filter.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (appointment) =>
          appointment.business?.businessName?.toLowerCase().includes(q) ||
          appointment.service?.name?.toLowerCase().includes(q) ||
          appointment.status?.toLowerCase().includes(q) ||
          appointment.date?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [appointments, filter, search]);

  useEffect(() => {
    if (!filteredAppointments.length) {
      setSelected(null);
      setShowReviewForm(false);
      return;
    }

    const exists = filteredAppointments.some(
      (appointment) => appointment._id === selected?._id
    );

    if (!exists) {
      setSelected(filteredAppointments[0]);
      setShowReviewForm(false);
    }
  }, [filteredAppointments, selected]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      upcoming: appointments.filter((a) =>
        ["pending", "confirmed"].includes((a.status || "").toLowerCase())
      ).length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments]);

  const handleSelect = (appointment) => {
    setSelected(appointment);
    setShowReviewForm(false);
  };

  const handleCancel = async () => {
    if (!selected) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      const res = await cancelMyAppointment(selected._id);
      const updated = res.data || res;

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === updated._id ? updated : appointment
        )
      );

      setSelected(updated);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Cancel appointment error:", error);
      alert("Failed to cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewCreated = () => {
    if (!selected) return;

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment._id === selected._id
          ? { ...appointment, hasReviewed: true }
          : appointment
      )
    );

    setSelected((prev) =>
      prev ? { ...prev, hasReviewed: true } : prev
    );

    setShowReviewForm(false);
  };

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Cancelled
          </span>
        );
      case "no_show":
        return (
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
            No-show
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const canCancel = ["pending", "confirmed"].includes(
    (selected?.status || "").toLowerCase()
  );

  const canReview =
    (selected?.status || "").toLowerCase() === "completed" &&
    !selected?.hasReviewed;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm opacity-90">Appointments</p>
            <h2 className="mt-1 text-2xl font-bold">Manage your bookings</h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              View upcoming appointments, check booking details, and manage your
              schedule from one place.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Upcoming" value={stats.upcoming} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Cancelled" value={stats.cancelled} />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                My Appointments
              </h3>
              <p className="text-sm text-slate-500">
                Browse your upcoming and past bookings
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search business or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-80"
                />
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                {["all", "pending", "confirmed", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                        filter === status
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-white"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12">
          <div className="xl:col-span-7 border-r border-slate-200 bg-slate-50/60">
            <div className="px-4 py-4 md:px-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <div className="col-span-4">Business</div>
                  <div className="col-span-3">Service</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Status</div>
                </div>

                {loading ? (
                  <div className="p-6 text-sm text-slate-500">
                    Loading appointments...
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      📅
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No appointments found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your bookings will appear here.
                    </p>
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => {
                    const isActive = selected?._id === appointment._id;

                    return (
                      <button
                        key={appointment._id}
                        onClick={() => handleSelect(appointment)}
                        className={`grid w-full grid-cols-12 items-center border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${
                          isActive
                            ? "border-l-4 border-blue-600 bg-blue-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="col-span-4">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {appointment.business?.businessName || "Business"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {appointment.time || "--:--"}
                          </p>
                        </div>

                        <div className="col-span-3 pr-2">
                          <p className="truncate text-sm text-slate-700">
                            {appointment.service?.name || "Service"}
                          </p>
                        </div>

                        <div className="col-span-2 text-sm text-slate-500">
                          {formatDate(appointment.date || appointment.createdAt)}
                        </div>

                        <div className="col-span-3">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 bg-white">
            <div className="h-full p-4 md:p-6">
              {!selected ? (
                <div className="flex h-full min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                  Select an appointment to view details
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {selected.business?.businessName || "Business"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {selected.service?.name || "Service"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {getStatusBadge(selected.status)}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Booking details
                    </p>

                    <div className="mt-4 space-y-4">
                      <DetailRow
                        icon={CalendarDays}
                        label="Date"
                        value={formatDate(selected.date || selected.createdAt)}
                      />
                      <DetailRow
                        icon={Clock3}
                        label="Time"
                        value={selected.time || "--:--"}
                      />
                      <DetailRow
                        icon={Building2}
                        label="Business"
                        value={selected.business?.businessName || "-"}
                      />
                      <DetailRow
                        icon={MapPin}
                        label="City"
                        value={selected.business?.city || "-"}
                      />
                    </div>
                  </div>

                  {selected.business?.address && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Address
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {selected.business.address}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {canCancel && (
                        <button
                          onClick={handleCancel}
                          disabled={cancelling}
                          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancelling ? "Cancelling..." : "Cancel Appointment"}
                        </button>
                      )}

                      {canReview && (
                        <button
                          onClick={() => setShowReviewForm((prev) => !prev)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <MessageSquarePlus size={16} />
                          {showReviewForm ? "Hide Review Form" : "Leave Review"}
                        </button>
                      )}

                      {selected.hasReviewed && (
                        <span className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
                          Review already submitted
                        </span>
                      )}

                      {!canCancel && !canReview && !selected.hasReviewed && (
                        <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                          No actions available for this booking
                        </div>
                      )}
                    </div>
                  </div>

                  {showReviewForm && canReview && (
                    <ReviewForm
                      appointmentId={selected._id}
                      onReviewCreated={handleReviewCreated}
                    />
                  )}

                  {selected.notes && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Notes
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {selected.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
          <Icon size={18} />
        </div>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}