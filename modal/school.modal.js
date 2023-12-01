import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    schoolID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    apiKey: {
        type: String,
        default: Math.floor(1000000 + Math.random() * 9000).toString(),
      },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

export default School;
