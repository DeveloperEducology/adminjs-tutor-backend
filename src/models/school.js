import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  }
});

const School = mongoose.model('School', schoolSchema);

export default School;