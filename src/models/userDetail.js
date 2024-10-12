import mongoose from "mongoose";
const Schema = mongoose.Schema;



const classSchema = new Schema({
  name: String,
});

const subjectSchema = new Schema({
  name: String,
});

const locationSchema = new Schema({
  name: String,
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
});

const pincodeSchema = new Schema({
  name: String,
  pincode: Number,
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
});

const boardSchema = new Schema({
  name: String,
});

const daySchema = new Schema({
  name: String,
});

export const Class = mongoose.model("Class", classSchema);
export const Subject = mongoose.model("Subject", subjectSchema);
export const Location = mongoose.model("Location", locationSchema);
export const Day = mongoose.model("Day", daySchema);
export const Pincode = mongoose.model("Pincode", pincodeSchema);
export const Board = mongoose.model("Board", boardSchema);
