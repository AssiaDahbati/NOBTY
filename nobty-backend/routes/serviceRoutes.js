const express = require("express");
const router = express.Router();

const {
  createService,
  getBusinessServices,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
} = require("../controllers/serviceController");

const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public/general
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected business actions
router.get("/business/:businessId", requireAuth, getBusinessServices);
router.post("/", requireAuth, upload.single("image"), createService);
router.put("/:id", requireAuth, upload.single("image"), updateService);
router.delete("/:id", requireAuth, deleteService);

module.exports = router;