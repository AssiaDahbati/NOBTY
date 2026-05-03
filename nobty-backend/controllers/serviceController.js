const Service = require("../models/Service");
const Business = require("../models/Business");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");

const createService = async (req, res) => {
  try {
    const { businessId, name, description, price, duration } = req.body;

    if (!businessId || !name || !price || !duration) {
      return res.status(400).json({
        message: "Business, name, price, and duration are required",
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        "nobty/services"
      );
      imageUrl = uploaded.secure_url;
    }

    const service = await Service.create({
      business: businessId,
      name: name.trim(),
      description: description ? description.trim() : "",
      price: Number(price),
      duration: Number(duration),
      image: imageUrl,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("createService error:", error);
    res.status(500).json({ message: "Server error while creating service" });
  }
};

const getBusinessServices = async (req, res) => {
  try {
    const services = await Service.find({
      business: req.params.businessId,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    console.error("getBusinessServices error:", error);
    res.status(500).json({ message: "Server error while fetching services" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "business",
      "businessName name city address"
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("getServiceById error:", error);
    res.status(500).json({ message: "Server error while fetching service" });
  }
};

const updateService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const service = await Service.findById(req.params.id).populate("business");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name !== undefined) service.name = name.trim();
    if (description !== undefined) service.description = description.trim();
    if (price !== undefined) service.price = Number(price);
    if (duration !== undefined) service.duration = Number(duration);

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        "nobty/services"
      );
      service.image = uploaded.secure_url;
    }

    await service.save();

    res.json(service);
  } catch (error) {
    console.error("updateService error:", error);
    res.status(500).json({ message: "Server error while updating service" });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("business");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await service.deleteOne();

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("deleteService error:", error);
    res.status(500).json({ message: "Server error while deleting service" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const { businessId } = req.query;

    const filter = {};
    if (businessId) {
      filter.business = businessId;
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("getAllServices error:", error);
    res.status(500).json({ message: "Server error while fetching services" });
  }
};

module.exports = {
  createService,
  getBusinessServices,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
};