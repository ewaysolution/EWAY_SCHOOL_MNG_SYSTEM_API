import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    schoolID: {
      type: String,
      required: true,
    },
    studentID: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    stream: {
      type: String
      
    },
    classType: {
      type: String,
    },
    subjectResults: [
      {
        _id: false,
        subjectID: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
    lastModifiedBy: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Marks = mongoose.model("Mark", marksSchema);

export default Marks;
