import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentID: {
      type: String,
      required: true,
      unique: true,
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
    active: {
      type: Boolean,
      default: true,
    },
    schoolID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);

export default Student;
