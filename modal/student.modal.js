import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: true,
      unique: true,
    },
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      // required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    name: {
      initial: {
        type: String,
        required: true,
        uppercase: true,
      },
      fname: {
        type: String,
        required: true,
        uppercase: true,
      },
      lname: {
        type: String,
        required: true,
        uppercase: true,
      },
      fullName: {
        type: String,
        required: true,
        uppercase: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },

    // age: {
    //   type: String,
    //   required: true,
    // },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
    },

    bloodGroup: {
      type: String,
      // enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  
    },
    religion: {
      type: String,
      enum: ["BUDDHISM", "HINDUISM", "ISLAM", "OTHER"],
      required: true,
    },
    contactInformation: {
      email: {
        type: String,
        // required: true,
      
      },
      contactNo: {
        type: String,
        // required: true,
      },
      guardianContactNo: {
        type: String,
        required: true,
      },

      address: {
        permanentAddress: {
          type: String,
          uppercase: true,
          required: true,
        },
        residentialAddress: {
          type: String,
          required: true,
          uppercase: true,
        },
      },
    },
    NIC: {
      NICNo: {
        type: String,
        unique: true,
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
    birthCertificate: {
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
    shortBIO: {
      type: String,
      // required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);

export default Student;
