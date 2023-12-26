import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectID: {
      type: String,
      required: true,
      unique: true,
    },

    subjectName: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("subject", subjectSchema);

export default Subject;
