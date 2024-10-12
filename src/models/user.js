import mongoose from "mongoose";

// Base User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },
  role: {
    type: String,
    enum: ["Student", "Admin", "Tutor"],
    required: false,
  },
  isActivated: { type: Boolean, default: false },
});

/// Student Schema
const studentSchema = new mongoose.Schema({
  ...userSchema.obj,
  phoneNumber: { type: String, required: true, unique: false },
  role: { type: String, enum: ["Student"], default: "Student" },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
});

/// Tutor Schema
const tutorSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: false, unique: false },
  role: { type: String, enum: ["Tutor"], default: "Tutor" },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  pincode: { type: mongoose.Schema.Types.ObjectId, ref: "Pincode" },
  fcmToken: {
    type: String,
    default: null,
  },
  isProfileVerified: {
    type: Boolean,
    default: false,
  },
  isNewUser: {
    type: Boolean,
    default: true,
  },

  hasProfile: {
    type: Boolean,
    default: false,
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
});

const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" },
});

export const Student = mongoose.model("Student", studentSchema);
export const Tutor = mongoose.model("Tutor", tutorSchema);
export const Admin = mongoose.model("Admin", adminSchema);
