const express = require("express");
const router = express.Router();

const {
  getStats,
  getBusinessRequests,
  approveBusiness,
  rejectBusiness,
  getClients,
  getProviders,
  getApprovedBusinesses,
  deleteUserByAdmin,
} = require("../controllers/adminController");

const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth, requireRole("admin"));

router.get("/stats", getStats);
router.get("/business-requests", getBusinessRequests);
router.get("/businesses", getApprovedBusinesses);
router.get("/clients", getClients);
router.get("/providers", getProviders);

router.patch("/businesses/:id/approve", approveBusiness);
router.patch("/businesses/:id/reject", rejectBusiness);

router.delete("/users/:id", deleteUserByAdmin);

module.exports = router;