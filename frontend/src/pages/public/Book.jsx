import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Building2,
  BadgeDollarSign,
  TimerReset,
  ShieldCheck,
  NotebookPen,
} from "lucide-react";
import api from "../../api/axios";

const FALLBACK_SERVICE_IMAGE =
  "https://via.placeholder.com/1200x700?text=Service+Image";

const TIME_OPTIONS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

function formatDisplayDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatDisplayTime(value) {
  if (!value) return "-";
  return value;
}

function formatPriceMAD(price) {
  return `${Number(price || 0)} MAD`;
}

function formatDateChipLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getNextDays(count = 10) {
  const days = [];

  for (let i = 0; i < count; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    days.push({
      value: `${yyyy}-${mm}-${dd}`,
      label: formatDateChipLabel(date),
    });
  }

  return days;
}

export default function Book() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const minDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const nextDays = useMemo(() => getNextDays(10), []);

  const summary = useMemo(() => {
    return {
      price: service?.price ?? 0,
      duration: service?.duration ?? 0,
      serviceName: service?.name ?? "-",
      businessName:
        service?.business?.businessName ||
        service?.business?.name ||
        "Business",
      businessId: service?.business?._id || "",
      serviceImage: service?.image || FALLBACK_SERVICE_IMAGE,
      description: service?.description || "No description available.",
    };
  }, [service]);

  const currentStep = useMemo(() => {
    if (bookingSuccess) return 3;
    if (date && time) return 2;
    return 1;
  }, [bookingSuccess, date, time]);

  const progressWidth = currentStep === 1 ? "33.333%" : currentStep === 2 ? "66.666%" : "100%";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!date || !time) {
      setError("Please choose both date and time.");
      return;
    }

    if (!serviceId) {
      setError("Service ID is missing.");
      return;
    }

    if (!summary.businessId) {
      setError("Business information is missing for this service.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const safeParse = (value) => {
        try {
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      };

      const storedUser =
        safeParse(localStorage.getItem("user")) ||
        safeParse(localStorage.getItem("authUser")) ||
        safeParse(localStorage.getItem("client")) ||
        safeParse(localStorage.getItem("currentUser"));

      const userId =
        localStorage.getItem("userId") ||
        storedUser?._id ||
        storedUser?.id ||
        storedUser?.userId;

      if (!token || !userId) {
        setError("User information is missing. Please log in again.");
        return;
      }

      const payload = {
        userId,
        businessId: summary.businessId,
        serviceId,
        date,
        time,
        notes: notes.trim(),
      };

      const res = await api.post("/appointments", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdAppointment = res.data?.data || res.data;

      setAppointment({
        ...createdAppointment,
        service: createdAppointment?.service || service,
        date: createdAppointment?.date || date,
        time: createdAppointment?.time || time,
        notes: createdAppointment?.notes || notes.trim(),
      });

      setBookingSuccess(true);
      setSuccessMessage("Appointment booked successfully.");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to create appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_40%,#f6f8fc_100%)] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-[#e8eef8] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-slate-500">Loading booking page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !service && !bookingSuccess) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_40%,#f6f8fc_100%)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!service && !bookingSuccess) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_40%,#f6f8fc_100%)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-[#e8eef8] bg-white p-8 shadow-sm">
          <p className="text-slate-600">Service not found.</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess && appointment) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_40%,#f6f8fc_100%)] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className="mb-6 rounded-[28px] border border-[#e8eef8] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Booking progress
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Completed
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-400">Step 3/3</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#132249_0%,#1f57d2_55%,#16a34a_100%)] transition-all duration-700 ease-out"
                style={{ width: "100%" }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#132249] text-sm font-bold text-white shadow-sm">
                  1
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Service
                </span>
              </div>

              <div className="hidden h-px w-12 bg-slate-300 md:block" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#132249] text-sm font-bold text-white shadow-sm">
                  2
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Date & Time
                </span>
              </div>

              <div className="hidden h-px w-12 bg-slate-300 md:block" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">
                  3
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="rounded-[30px] border border-[#e8eef8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
              <div className="mb-6 rounded-[24px] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Your booking is confirmed
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Your reservation was created successfully. Keep this page
                      saved and use the QR code if verification is needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Service
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {appointment.service?.name || summary.serviceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Business
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {appointment.business?.businessName ||
                      appointment.service?.business?.businessName ||
                      appointment.service?.business?.name ||
                      summary.businessName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {formatDisplayDate(appointment.date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Time
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {formatDisplayTime(appointment.time)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-base font-bold capitalize text-emerald-600">
                    {appointment.status || "pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Booking ID
                  </p>
                  <p className="mt-2 break-all text-base font-bold text-slate-900">
                    {appointment._id}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#132249]" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Check-in QR Code
                  </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  This QR code stores your appointment information for quick
                  verification.
                </p>

                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <QRCode
                      size={190}
                      value={JSON.stringify({
                        appointmentId: appointment._id,
                        service: appointment.service?.name || summary.serviceName,
                        business:
                          appointment.business?.businessName ||
                          appointment.service?.business?.businessName ||
                          appointment.service?.business?.name ||
                          summary.businessName,
                        date: appointment.date,
                        time: appointment.time,
                        status: appointment.status || "pending",
                      })}
                    />
                  </div>

                  <p className="max-w-sm text-center text-xs text-slate-500">
                    Show this QR code at the business if they use appointment
                    verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#e8eef8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-black text-slate-900">
                Reservation summary
              </h3>

              <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
                <img
                  src={summary.serviceImage}
                  alt={summary.serviceName}
                  className="h-52 w-full object-cover"
                />
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected service
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {summary.serviceName}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Price</span>
                    <span className="font-bold text-emerald-600">
                      {formatPriceMAD(summary.price)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-bold text-slate-900">
                      {summary.duration} min
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold text-slate-900">
                      {formatDisplayDate(appointment.date)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-bold text-slate-900">
                      {formatDisplayTime(appointment.time)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/account/appointments")}
                  className="w-full rounded-2xl bg-[#132249] px-5 py-3.5 font-semibold text-white transition hover:opacity-90"
                >
                  View My Appointments
                </button>

                <button
                  onClick={() => navigate("/businesses")}
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_40%,#f6f8fc_100%)] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="mb-6 rounded-[28px] border border-[#e8eef8] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Booking progress
              </span>
              <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#1f57d2]">
                In progress
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-400">
              Step {currentStep}/3
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#132249_0%,#1f57d2_55%,#16a34a_100%)] transition-all duration-700 ease-out"
              style={{ width: progressWidth }}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-7">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all duration-500 ${
                  currentStep >= 1
                    ? "bg-[#132249] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-semibold ${
                  currentStep >= 1 ? "text-slate-700" : "text-slate-500"
                }`}
              >
                Service
              </span>
            </div>

            <div className="hidden h-px w-12 bg-slate-300 md:block" />

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all duration-500 ${
                  currentStep >= 2
                    ? "bg-[#132249] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-semibold ${
                  currentStep >= 2 ? "text-slate-700" : "text-slate-500"
                }`}
              >
                Date & Time
              </span>
            </div>

            <div className="hidden h-px w-12 bg-slate-300 md:block" />

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all duration-500 ${
                  currentStep >= 3
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-semibold ${
                  currentStep >= 3 ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e8eef8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
              <img
                src={summary.serviceImage}
                alt={summary.serviceName}
                className="h-72 w-full object-cover"
              />
            </div>

            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#eefbf3] px-3 py-1.5 text-xs font-semibold text-[#18794e]">
                  <ShieldCheck size={14} />
                  Verified service
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                {summary.serviceName}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                {summary.description}
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Business
                  </span>
                </div>
                <p className="mt-3 text-base font-bold text-slate-900">
                  {summary.businessName}
                </p>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7fffb_100%)] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <BadgeDollarSign size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Price
                  </span>
                </div>
                <p className="mt-3 text-base font-bold text-emerald-600">
                  {formatPriceMAD(summary.price)}
                </p>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <TimerReset size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="mt-3 text-base font-bold text-slate-900">
                  {summary.duration} min
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Choose a date
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {nextDays.map((day) => {
                    const selected = date === day.value;

                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => setDate(day.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                          selected
                            ? "border-[#132249] bg-[#132249] text-white shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#c8d7f5] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          <span className="text-sm font-semibold">
                            {day.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Or choose another date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={minDate}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#132249] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Choose a time
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {TIME_OPTIONS.map((option) => {
                    const selected = time === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTime(option)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                          selected
                            ? "border-[#132249] bg-[#132249] text-white shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#c8d7f5] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Clock3 size={15} />
                          {option}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Or enter another time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#132249] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Optional note for the business..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#132249] focus:bg-white"
                  />
                  <NotebookPen
                    size={18}
                    className="pointer-events-none absolute right-4 top-4 text-slate-400"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#132249] px-5 py-4 text-base font-bold text-white shadow-[0_12px_24px_rgba(19,34,73,0.2)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          <div className="h-fit rounded-[30px] border border-[#e8eef8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] xl:sticky xl:top-6">
            <h2 className="text-2xl font-black text-slate-900">
              Reservation summary
            </h2>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
              <img
                src={summary.serviceImage}
                alt={summary.serviceName}
                className="h-44 w-full object-cover"
              />
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Service
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {summary.serviceName}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="font-bold text-emerald-600">
                    {formatPriceMAD(summary.price)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-slate-900">
                    {summary.duration} min
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Selected date</span>
                  <span className="font-bold text-slate-900">
                    {date ? formatDisplayDate(date) : "-"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Selected time</span>
                  <span className="font-bold text-slate-900">
                    {time || "-"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-500">
                  After confirmation, your appointment details and QR code will
                  appear in the success screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}