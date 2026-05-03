const mongoose = require("mongoose");
const User = require("../models/User");
const Business = require("../models/Business");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../middleware/asyncHandler");

/* ===============================
   Dashboard statistics
================================ */
const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalBusinesses,
    pendingBusinesses,
    totalAppointments,
    totalProviders,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Business.countDocuments(),
    Business.countDocuments({ isApproved: false }),
    Appointment.countDocuments(),
    User.countDocuments({ role: "business_owner" }),
  ]);

  res.json({
    totalUsers,
    totalProviders,
    totalBusinesses,
    pendingBusinesses,
    totalAppointments,
  });
});

/* ===============================
   Pending business requests
================================ */
const getBusinessRequests = asyncHandler(async (req, res) => {
  const businesses = await Business.find({ isApproved: false })
    .populate("owner", "email phone role")
    .sort({ createdAt: -1 });

  res.json(businesses);
});

/* ===============================
   Approve business
================================ */
const approveBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  business.isApproved = true;
  await business.save();

  res.json({ message: "Business approved", business });
});

/* ===============================
   Reject business (delete it)
================================ */
const rejectBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  await business.deleteOne();

  res.json({ message: "Business rejected and deleted" });
});

/* ===============================
   Clients
================================ */
const getClients = asyncHandler(async (req, res) => {
  const clients = await User.find({ role: "user" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(clients);
});

/* ===============================
   Delete user
================================ */
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.json({ message: "User deleted" });
});

 
const getProviders = asyncHandler(async (req, res) => {
  const providers = await User.find({ role: "business_owner" })
    .select("_id email phone createdAt role")
    .sort({ createdAt: -1 });

  res.json(providers);
});

 
const getApprovedBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find({ isApproved: true })
    .populate("owner", "email phone role")
    .sort({ createdAt: -1 });

  res.json(businesses);
});

module.exports = {
  getStats,
  getBusinessRequests,
  approveBusiness,
  rejectBusiness,
  getClients,
  deleteUserByAdmin,
  getProviders,
  getApprovedBusinesses,
};