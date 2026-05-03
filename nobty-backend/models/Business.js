const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema(
  {
    isOpen: {
      type: Boolean,
      default: false,
    },
    open: {
      type: String,
      default: "",
    },
    close: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },

    mainPhoto: {
      type: String,
      default: "",
    },
    photos: {
      type: [String],
      default: [],
    },

    schedule: {
      monday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      tuesday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      wednesday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      thursday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      friday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      saturday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
      sunday: {
        type: dayScheduleSchema,
        default: () => ({ isOpen: false, open: "", close: "" }),
      },
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);