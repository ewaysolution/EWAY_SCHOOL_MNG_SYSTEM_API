import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const registerTeacher = async (req, res, next) => {
  console.log(req.body);
  const {
    schoolID,
    teacherID,
    password,
    avatar,
    medium,
    name,
    gender,
    religion,
    dob,
    nic,
    email,
    userType,
    shortBIO,
    active,
  } = req.body;

  try {
    const teacherDetails = await prisma.teacher.findMany({
      where: {
        OR: [{ teacherID: teacherID }, { nic: nic }, { email: email }],
      },
    });

    if (teacherDetails && teacherDetails.length > 0) {
      next(errorHandler(401, "Teacher Already Exists"));
    } else {
      req.body.password = bcryptjs.hashSync(password, 10);

      const newTeacher = await prisma.teacher.create({
        data: {
          teacherID: req.body.teacherID,
          password: req.body.password,
          avatar: req.body.avatar,
          medium: req.body.medium,
          initial: req.body.initial,
          fname: req.body.fname,
          lname: req.body.lname,
          fullName: req.body.fullName,
          gender: req.body.gender,
          religion: req.body.religion,
          dob: new Date(req.body.dob),
          nic: req.body.nic,
          residentialAddress: req.body.residentialAddress,
          permanentAddress: req.body.permanentAddress,
          mobile: req.body.mobile,
          home: req.body.home,
          email: req.body.email,
          userType: req.body.userType,
          shortBIO: req.body.shortBIO,
          active: req.body.active,
          schoolID: req.body.schoolID,
        },
      });

      res.status(201).json({
        message: "Successfully registered",
        teacherDetails: newTeacher,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const teacherDetails = await prisma.teacher.findMany({
      where: {
        teacherID: req.params.teacherID,
      },
      include: {
        subjects: true, // Include related SubjectTaken data
        school: true,
      },
    });
    if (teacherDetails.length === 0) {
      next(errorHandler(401, "No teachers registered"));
    } else {
      res.status(201).json({
        message: "Get Teacher Details Successfully",
        teachers: teacherDetails,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const subjectTaken = async (req, res, next) => {
  const { subjectID, teacherID, schoolID, grade } = req.body;

  try {
    const subTaken = await prisma.SubjectTaken.findMany({
      where: {
        AND: [
          { subjectID: subjectID },
          { teacherID: teacherID },
          { schoolID: schoolID },
        ],
      },
    });

    // If email or contact already exists, return an error
    if (subTaken.length > 0) {
      res.status(400).json({
        success: false,
        message: "Subject already assigned to him",
      });
      return;
    }

    const SubjectTakenDetails = await prisma.SubjectTaken.create({
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Subject assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// // get all Teacher details
// export const getAllTeacherDetails = async (req, res, next) => {
//   const { schoolID } = req.params;

//   try {
//     const TeacherDetails = await Teacher.find({
//       schoolID: schoolID,
//     });
//     if (TeacherDetails.length === 0) {
//       next(errorHandler(401, "Teacher Details Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Teacher Details Fetched",
//         TeacherDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// // delete Teacher
// export const deleteTeacher = async (req, res, next) => {
//   const { schoolID, teacherID } = req.params;
//   // console.log(req.params);

//   try {
//     const TeacherDetails = await Teacher.deleteOne({
//       schoolID,
//       teacherID,
//     });
//     if (TeacherDetails.deletedCount === 0) {
//       next(errorHandler(401, "Teacher Details Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Teacher Details Deleted Successfully",
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// //
// export const getTeacherWithSchoolDetails = async (req, res, next) => {
//   console.log(req.params.teacherID);
//   try {
//     const teacherDetails = await Teacher.aggregate([
//       {
//         $match: {
//           teacherID: req.params.teacherID,
//         },
//       },
//       {
//         $lookup: {
//           from: "schools", // Assuming your School collection is named 'schools'
//           localField: "schoolID",
//           foreignField: "schoolID",
//           as: "schoolDetails",
//         },
//       },
//     ]);

//     if (teacherDetails.length === 0) {
//       return next(errorHandler(401, "Teacher Details Not Found"));
//     }

//     res.status(201).json({
//       message: "Teacher Details Fetched",
//       teacherDetails,
//     });
//   } catch (error) {
//     next(error.message);
//   }
// };

// {
//   "status": "UNAUTHORIZED",
//   "message": "Full authentication is required to access this resource",
//   "path": "/gps/rest/v1/transporter/vehicle/",
//   "code": 401
// }
