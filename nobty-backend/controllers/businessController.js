const Business = require("../models/Business");
const Service = require("../models/Service");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../middleware/asyncHandler");


const buildDefaultSchedule = () => ({
  monday: { isOpen: false, open: "", close: "" },
  tuesday: { isOpen: false, open: "", close: "" },
  wednesday: { isOpen: false, open: "", close: "" },
  thursday: { isOpen: false, open: "", close: "" },
  friday: { isOpen: false, open: "", close: "" },
  saturday: { isOpen: false, open: "", close: "" },
  sunday: { isOpen: false, open: "", close: "" },
});

const normalizeSchedule = (schedule) => {
  const defaultSchedule = buildDefaultSchedule();

  if (!schedule || typeof schedule !== "object") {
    return defaultSchedule;
  }

  for (const day of Object.keys(defaultSchedule)) {
    if (schedule[day]) {
      defaultSchedule[day] = {
        isOpen: Boolean(schedule[day].isOpen),
        open: schedule[day].open || "",
        close: schedule[day].close || "",
      };
    }
  }

  return defaultSchedule;
};

const createBusiness = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { businessName, category, city, address, phone, description } = req.body;

    if (!businessName || !category || !city) {
      return res.status(400).json({
        message: "Business name, category, and city are required",
      });
    }

    let parsedSchedule = buildDefaultSchedule();

    if (req.body.schedule) {
      try {
        parsedSchedule = normalizeSchedule(JSON.parse(req.body.schedule));
      } catch (error) {
        return res.status(400).json({ message: "Invalid schedule format" });
      }
    }

    let mainPhotoUrl = "";
    let galleryUrls = [];

    if (req.files?.mainPhoto?.[0]) {
      const mainUpload = await uploadBufferToCloudinary(
        req.files.mainPhoto[0].buffer,
        "nobty/businesses/main"
      );
      mainPhotoUrl = mainUpload.secure_url;
    }

    if (req.files?.photos?.length) {
      const galleryUploads = await Promise.all(
        req.files.photos.map((file) =>
          uploadBufferToCloudinary(file.buffer, "nobty/businesses/gallery")
        )
      );

      galleryUrls = galleryUploads.map((item) => item.secure_url);
    }

    const business = await Business.create({
      owner: req.user._id,
      businessName,
      category,
      city,
      address: address || "",
      phone: phone || "",
      description: description || "",
      mainPhoto: mainPhotoUrl,
      photos: galleryUrls,
      schedule: parsedSchedule,
      isApproved: false,
    });

    return res.status(201).json(business);
  } catch (error) {
    console.error("createBusiness error:", error);
    return res.status(500).json({
      message: error.message || "Server error while creating business",
    });
  }
};

const getAllBusinesses = async (req, res) => {
  try {
    const filter = { isApproved: true };

    if (req.query.city) {
      filter.city = req.query.city;
    }

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error("getAllBusinesses error:", error);
    res.status(500).json({ message: "Server error while fetching businesses" });
  }
};



const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      "owner",
      "email phone role"
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const services = await Service.find({ business: business._id }).sort({
      createdAt: -1,
    });

    res.json({
      ...business.toObject(),
      services,
    });
  } catch (error) {
    console.error("getBusinessById error:", error);
    res.status(500).json({ message: "Server error while fetching business" });
  }
};

const getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    console.error("getMyBusiness error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      businessName,
      category,
      city,
      address,
      phone,
      description,
      keepExistingPhotos,
    } = req.body;

    if (businessName !== undefined) business.businessName = businessName;
    if (category !== undefined) business.category = category;
    if (city !== undefined) business.city = city;
    if (address !== undefined) business.address = address;
    if (phone !== undefined) business.phone = phone;
    if (description !== undefined) business.description = description;

    if (req.body.schedule) {
      try {
        business.schedule = normalizeSchedule(JSON.parse(req.body.schedule));
      } catch (error) {
        return res.status(400).json({ message: "Invalid schedule format" });
      }
    }

    if (req.files?.mainPhoto?.[0]) {
      const mainUpload = await uploadBufferToCloudinary(
        req.files.mainPhoto[0].buffer,
        "nobty/businesses/main"
      );
      business.mainPhoto = mainUpload.secure_url;
    }

    let oldPhotos = business.photos || [];

    if (keepExistingPhotos) {
      try {
        oldPhotos = JSON.parse(keepExistingPhotos);
      } catch (error) {
        oldPhotos = business.photos || [];
      }
    }

    let newGalleryUrls = [];

    if (req.files?.photos?.length) {
      const galleryUploads = await Promise.all(
        req.files.photos.map((file) =>
          uploadBufferToCloudinary(file.buffer, "nobty/businesses/gallery")
        )
      );

      newGalleryUrls = galleryUploads.map((item) => item.secure_url);
    }

    business.photos = [...oldPhotos, ...newGalleryUrls];

    await business.save();

    res.json(business);
  } catch (error) {
    console.error("updateBusiness error:", error);
    res.status(500).json({ message: "Server error while updating business" });
  }
};

const getPendingBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ isApproved: false })
      .populate("owner", "email phone role")
      .sort({ createdAt: -1 });

    res.json(businesses);
  } catch (error) {
    console.error("getPendingBusinesses error:", error);
    res.status(500).json({ message: "Server error while fetching pending businesses" });
  }
};

const approveBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.isApproved = true;
    await business.save();

    res.json({ message: "Business approved successfully", business });
  } catch (error) {
    console.error("approveBusiness error:", error);
    res.status(500).json({ message: "Server error while approving business" });
  }
};

const deleteBusinessByAdmin = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    await business.deleteOne();

    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("deleteBusinessByAdmin error:", error);
    res.status(500).json({ message: "Server error while deleting business" });
  }
};

const getAllBusinessesForAdmin = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("owner", "email phone role")
      .sort({ createdAt: -1 });

    res.json(businesses);
  } catch (error) {
    console.error("getAllBusinessesForAdmin error:", error);
    res.status(500).json({ message: "Server error while fetching all businesses" });
  }
};

const updateWorkingHours = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { schedule } = req.body;

  if (!schedule || typeof schedule !== "object") {
    res.status(400);
    throw new Error("Schedule is required");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (business.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  business.schedule = normalizeSchedule(schedule);

  await business.save();

  res.status(200).json({
    message: "Working hours updated successfully",
    data: business.schedule,
  });
});

const updateBusinessByAdmin = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const {
      businessName,
      category,
      city,
      address,
      phone,
      description,
      isApproved,
      keepExistingPhotos,
    } = req.body;

    if (businessName !== undefined) business.businessName = businessName;
    if (category !== undefined) business.category = category;
    if (city !== undefined) business.city = city;
    if (address !== undefined) business.address = address;
    if (phone !== undefined) business.phone = phone;
    if (description !== undefined) business.description = description;
    if (isApproved !== undefined) {
      business.isApproved = isApproved === "true" || isApproved === true;
    }

    if (req.body.schedule) {
      try {
        business.schedule = normalizeSchedule(JSON.parse(req.body.schedule));
      } catch (error) {
        return res.status(400).json({ message: "Invalid schedule format" });
      }
    }

    if (req.files?.mainPhoto?.[0]) {
      const mainUpload = await uploadBufferToCloudinary(
        req.files.mainPhoto[0].buffer,
        "nobty/businesses/main"
      );
      business.mainPhoto = mainUpload.secure_url;
    }

    let oldPhotos = business.photos || [];

    if (keepExistingPhotos) {
      try {
        oldPhotos = JSON.parse(keepExistingPhotos);
      } catch (error) {
        oldPhotos = business.photos || [];
      }
    }

    let newGalleryUrls = [];

    if (req.files?.photos?.length) {
      const galleryUploads = await Promise.all(
        req.files.photos.map((file) =>
          uploadBufferToCloudinary(file.buffer, "nobty/businesses/gallery")
        )
      );

      newGalleryUrls = galleryUploads.map((item) => item.secure_url);
    }

    business.photos = [...oldPhotos, ...newGalleryUrls];

    await business.save();

    res.json({ message: "Business updated successfully", business });
  } catch (error) {
    console.error("updateBusinessByAdmin error:", error);
    res.status(500).json({ message: "Server error while updating business" });
  }
};

module.exports = {
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
};