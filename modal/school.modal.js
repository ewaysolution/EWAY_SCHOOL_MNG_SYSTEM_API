import mongoose from "mongoose";
 

const schoolSchema = new mongoose.Schema(
  {
    schoolID: {
      type: String,
      required: true,
      unique: true,
    },
    censusNumber: {
      type: String,
    },
    type: {
      type: String,
    },
    zone: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    studentCount: {
      type: Number
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      default: "Admin",
    },
    avatar: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

export default School;
