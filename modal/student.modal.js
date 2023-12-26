import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    contactInformation: {
      email: {
        type: String,
        required: true,
        unique: true, // Enforce uniqueness for email addresses
      },
      contactNo: {
        type: String,
        // required: true,
      },
      guidanceContactNo: {
        type: String,
      },
      address: {
        permanentAddress: {
          type: String,
          // required: true,
        },
        residentialAddress: {
          type: String,
          required: true,
        },
      },
    },
    NIC: {
      NICNo: {
        type: String,
        // required: true,
      },
      NICFront: {
        type: String,
        // required: true,
      },
      NICBack: {
        type: String,
        // required: true,
      },
    },
    birthCertificate:  
      {
        certificateNo: {
          type: String,
          // required: true,
        },
        birthCertificateFront: {
          type: String,
          // required: true,
        },
        birthCertificateBack: {
          type: String,
          // required: true,
        },
      },
 
    schoolID: {
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

const Student = mongoose.model("student", studentSchema);

export default Student;