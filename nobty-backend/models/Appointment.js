const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    date: {
      type: String, 
      required: true,
    },

    time: {
      type: String, 
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",     // just booked
        "confirmed",   // approved by business
        "completed",   // finished
        "cancelled",   // cancelled manually
        "no_show",     // DID NOT COME 
      ],
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
    },

    //  TRACK USER BEHAVIOR (for blacklist system)
    isNoShow: {
  type: Boolean,
  default: false,
  index: true, // optional (faster queries later)
},

    
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);