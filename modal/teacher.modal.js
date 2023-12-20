import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    subjects: [
      {
        subjectID: String,
        type: String,
      },
    ],
    contactNo: {
      type: String,
      required: true,
    },
    merrageStatus: {
      type: String,
      required: true,
    },
    experience: [
      {
        workplace: { type: String },
        from: { type: String },
        To: { type: String },
      },
    ],
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
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

const Teacher = mongoose.model("teacher", teacherSchema);

export default Teacher;
