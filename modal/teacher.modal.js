import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherID: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
    DOB: {
      type: String,
      required: true,
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
    subjects: [
      {
        subjectID: { type: String, required: true },
        grade: { type: String, required: true },
      },
    ],
    contactInformation: {
      contactNo: {
         home:{ type: String, required: true },
         mobile: { type: String, required: true },
      },
      email: {
        type: String,
        required: true,
      },
      address : {
        permanentAddress: {
          type: String,
          uppercase: true,
        },
        residentialAddress: {
          type: String,
          required: true,
          uppercase: true,
        },
      }
    },
    marriageStatus: {
      type: String,
      // required: true,
    },
    experience: [
      {
        workplace: { type: String },
        from: { type: String },
        To: { type: String },
      },
    ],

    apiKey: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "Teacher",
    },
    shortBIO: {
      type: String,
    },
    schoolID: {
      type: String,
      required: true,
    },
    appointment: {
      appointmentTitle: {
        type: String,
      },
      appointmentDate: {
        type: String,
      },
      appointmentLatter: {
        type: String,
      },
      appointmentRemark: {
        type: String,
      },
    },
    otherDocument: {
      type: String,
      required: true,
    },
    censusNumber: {
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

const Teacher = mongoose.model("teacher", teacherSchema);

export default Teacher;
