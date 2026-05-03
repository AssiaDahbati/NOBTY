const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getBusinessAppointments,
  getUserAppointments,
  updateAppointmentStatus,
  getBusinessAnalytics,
} = require("../controllers/appointmentController");

const { requireAuth } = require("../middleware/authMiddleware");

router.post("/", requireAuth, createAppointment);

router.get("/analytics/:businessId", requireAuth, getBusinessAnalytics);

router.get("/business/:businessId", requireAuth, getBusinessAppointments);

router.get("/user/:userId", requireAuth, getUserAppointments);

router.patch("/:id/status", requireAuth, updateAppointmentStatus);

module.exports = router;