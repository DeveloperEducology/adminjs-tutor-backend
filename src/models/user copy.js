import mongoose from "mongoose";

// Base User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },
  role: {
    type: String,
    enum: ["Student", "Admin", "Tutor"],
    required: true,
  },
  isActivated: { type: Boolean, default: false },
});

/// Student Schema
const StudentSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["Student"], default: "Student" },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
});

/// Tutor Schema
const TutorSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["Tutor"], default: "Tutor" },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" },
});

export const Student = mongoose.model("Student", StudentSchema);
export const Tutor = mongoose.model(
  "Tutor",
  TutorSchema
);
export const Admin = mongoose.model("Admin", adminSchema);
