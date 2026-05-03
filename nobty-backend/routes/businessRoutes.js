const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  getMyBusiness,
  updateBusiness,
  getPendingBusinesses,
  approveBusiness,
  deleteBusinessByAdmin,
  getAllBusinessesForAdmin,
  updateBusinessByAdmin,
  updateWorkingHours,
} = require("../controllers/businessController");

const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public
router.get("/", getAllBusinesses);
router.get("/my-business", requireAuth, getMyBusiness);
router.get("/:id", getBusinessById);

// Business owner
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  createBusiness
);



router.put(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  updateBusiness
);

router.put("/:businessId/working-hours", requireAuth, updateWorkingHours);

// Admin
router.get("/pending", requireAuth, getPendingBusinesses);
router.get("/admin/all", requireAuth, getAllBusinessesForAdmin);
router.patch("/:id/approve", requireAuth, approveBusiness);

router.put(
  "/admin/:id",
  requireAuth,
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  updateBusinessByAdmin
);

router.delete("/:id", requireAuth, deleteBusinessByAdmin);

module.exports = router;