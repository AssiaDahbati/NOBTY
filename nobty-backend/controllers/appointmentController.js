const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const Business = require("../models/Business");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const sendNotification = require("../utils/sendNotification");

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getDayName(dateString) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date(dateString).getDay()];
}

const createAppointment = asyncHandler(async (req, res) => {
  const { userId, businessId, serviceId, date, time } = req.body;

  if (!userId || !businessId || !serviceId || !date || !time) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    res.status(400);
    throw new Error("Invalid business ID");
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    res.status(400);
    throw new Error("Invalid service ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const restriction = user.bookingRestriction || {};

  if (
    restriction.isRestricted &&
    restriction.endDate &&
    new Date(restriction.endDate) > new Date()
  ) {
    res.status(403);
    throw new Error(
      `Your booking access is temporarily restricted until ${new Date(
        restriction.endDate
      ).toLocaleDateString("en-GB")}`
    );
  }

  if (
    restriction.isRestricted &&
    restriction.endDate &&
    new Date(restriction.endDate) <= new Date()
  ) {
    user.bookingRestriction = {
      isRestricted: false,
      reason: "",
      startDate: null,
      endDate: null,
      consecutiveNoShows: 0,
    };
    await user.save();
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  const business = await Business.findById(businessId);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const schedule = business.schedule || {};
  const dayName = getDayName(date).toLowerCase();
  const daySchedule = schedule[dayName];

  if (!daySchedule || !daySchedule.isOpen) {
    res.status(400);
    throw new Error(`Business is closed on ${dayName}`);
  }

  const selectedTime = timeToMinutes(time);
  const openTime = timeToMinutes(daySchedule.open);
  const closeTime = timeToMinutes(daySchedule.close);
  const serviceEndTime = selectedTime + Number(service.duration);

  if (selectedTime < openTime || selectedTime >= closeTime) {
    res.status(400);
    throw new Error("Selected time is outside business working hours");
  }

  if (serviceEndTime > closeTime) {
    res.status(400);
    throw new Error("Service ends after business closing time");
  }

  const existingAppointment = await Appointment.findOne({
    business: businessId,
    date,
    time,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingAppointment) {
    res.status(409);
    throw new Error("This time slot is already booked");
  }

  const appointment = await Appointment.create({
    user: userId,
    business: businessId,
    service: serviceId,
    date,
    time,
    status: "pending",
    isNoShow: false,
  });

  if (business.owner) {
    await sendNotification(req, {
      recipient: business.owner,
      sender: userId,
      title: "New appointment request",
      message: `New booking for ${service.name} on ${date} at ${time}`,
      type: "appointment_created",
      relatedId: appointment._id,
    });
  }

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate("user", "fullName name username email phone role bookingRestriction")
    .populate("service", "name duration price")
    .populate("business", "businessName city address");

  res.status(201).json({
    message: "Appointment booked successfully",
    data: populatedAppointment,
  });
});

const getBusinessAppointments = asyncHandler(async (req, res) => {
  const { businessId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    res.status(400);
    throw new Error("Invalid business ID");
  }

  const appointments = await Appointment.find({ business: businessId })
    .populate("user", "fullName name username email phone role bookingRestriction")
    .populate("service", "name duration price")
    .populate("business", "businessName city address")
    .sort({ date: -1, time: -1 });

  res.status(200).json(appointments);
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const appointments = await Appointment.find({ user: userId })
    .populate("service", "name duration price")
    .populate("business", "businessName city address phone")
    .sort({ date: -1, time: -1 });

  res.status(200).json(appointments);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid appointment ID");
  }

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const business = await Business.findById(appointment.business);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (business.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this appointment");
  }

  const user = await User.findById(appointment.user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.bookingRestriction) {
    user.bookingRestriction = {
      isRestricted: false,
      reason: "",
      startDate: null,
      endDate: null,
      consecutiveNoShows: 0,
    };
  }

  appointment.status = status;
  appointment.isNoShow = status === "no_show";

  if (req.user?._id) {
    appointment.updatedBy = req.user._id;
  }

  if (status === "no_show") {
    const currentCount = user.bookingRestriction.consecutiveNoShows || 0;
    const newCount = currentCount + 1;

    user.bookingRestriction.consecutiveNoShows = newCount;

    if (newCount >= 2) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      user.bookingRestriction.isRestricted = true;
      user.bookingRestriction.reason = "Multiple no-show appointments";
      user.bookingRestriction.startDate = startDate;
      user.bookingRestriction.endDate = endDate;
    }
  }

  if (status === "completed") {
    user.bookingRestriction.consecutiveNoShows = 0;
  }

  if (status === "cancelled") {
    appointment.isNoShow = false;
  }

  await appointment.save();
  await user.save();

  if (status === "confirmed") {
    await sendNotification(req, {
      recipient: appointment.user,
      sender: req.user._id,
      title: "Appointment confirmed",
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`,
      type: "appointment_confirmed",
      relatedId: appointment._id,
    });
  }

  if (status === "cancelled") {
    await sendNotification(req, {
      recipient: appointment.user,
      sender: req.user._id,
      title: "Appointment cancelled",
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been cancelled.`,
      type: "appointment_cancelled",
      relatedId: appointment._id,
    });
  }

  if (status === "completed") {
    await sendNotification(req, {
      recipient: appointment.user,
      sender: req.user._id,
      title: "Appointment completed",
      message: "Your appointment has been completed. You can now leave a review.",
      type: "system",
      relatedId: appointment._id,
    });
  }

  if (status === "no_show") {
    await sendNotification(req, {
      recipient: appointment.user,
      sender: req.user._id,
      title: "Missed appointment",
      message: `You missed your appointment on ${appointment.date} at ${appointment.time}. Please avoid repeated no-shows.`,
      type: "system",
      relatedId: appointment._id,
    });
  }

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate("user", "fullName name username email phone role bookingRestriction")
    .populate("service", "name duration price")
    .populate("business", "businessName city address");

  res.status(200).json({
    message: "Appointment status updated successfully",
    data: updatedAppointment,
  });
});

const getBusinessAnalytics = asyncHandler(async (req, res) => {
  const { businessId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    res.status(400);
    throw new Error("Invalid business ID");
  }

  const appointments = await Appointment.find({ business: businessId })
    .populate("service", "name price duration")
    .lean();

  const stats = {
    total: appointments.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
    revenue: 0,
  };

  const monthlyMap = {};
  const serviceMap = {};

  appointments.forEach((appointment) => {
    if (stats[appointment.status] !== undefined) {
      stats[appointment.status] += 1;
    }

    if (appointment.status === "completed" && appointment.service?.price) {
      stats.revenue += Number(appointment.service.price);
    }

    const date = new Date(appointment.date);
    const month = date.toLocaleString("en-US", { month: "short" });

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,
        bookings: 0,
        revenue: 0,
      };
    }

    monthlyMap[month].bookings += 1;

    if (appointment.status === "completed" && appointment.service?.price) {
      monthlyMap[month].revenue += Number(appointment.service.price);
    }

    const serviceName = appointment.service?.name || "Unknown Service";

    if (!serviceMap[serviceName]) {
      serviceMap[serviceName] = {
        name: serviceName,
        bookings: 0,
      };
    }

    serviceMap[serviceName].bookings += 1;
  });

  const monthly = Object.values(monthlyMap);
  const topServices = Object.values(serviceMap)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cancellationRate =
    stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0;

  res.status(200).json({
    stats,
    monthly,
    topServices,
    completionRate,
    cancellationRate,
  });
});

module.exports = {
  createAppointment,
  getBusinessAppointments,
  getUserAppointments,
  updateAppointmentStatus,
  getBusinessAnalytics,
};