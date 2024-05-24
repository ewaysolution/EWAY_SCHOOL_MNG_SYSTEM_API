import { generateApiKey } from "generate-api-key";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// register student
export const registerStudent = async (req, res, next) => {
  let studentsData = req.body;

  try {
    const existingStudents = await prisma.student.findMany({
      where: {
        AND: [
          { schoolID: studentsData.schoolID },
          { studentID: studentsData.studentID },
        ],
      },
    });

    if (existingStudents && existingStudents.length > 0) {
      next(errorHandler(401, "Students already exist"));
    } else {
      const hashedPassword = bcryptjs.hashSync(studentsData.password, 10);

      const newStudents = await prisma.student.create({
        data: {
          ...studentsData,
          password: hashedPassword,
        },
      });

      res.status(201).json({
        message: "Students registered successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getStudentByID = async (req, res, next) => {
  const { studentID, schoolID } = req.params;

  try {
    const StudentDetails = await prisma.student.findMany({
      where: {
        studentID: studentID,
        schoolID: schoolID,
      },

      include: {
        marks: true,
      },
    });

    if (StudentDetails.length === 0) {
      next(errorHandler(401, "Student Not Found"));
    } else {
      res.status(201).json({
        message: "Student Details Fetched",
        StudentDetails: StudentDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const getAllStudentBySchoolID = async (req, res, next) => {
  const { schoolID } = req.params;

  try {
    const StudentsDetails = await prisma.student.findMany({
      where: {
        schoolID: schoolID,
      },

      include: {
        marks: true,
      },
    });

    if (StudentsDetails.length === 0) {
      next(errorHandler(401, "Students Not Found in this school"));
    } else {
      res.status(201).json({
        message: "Students Details Fetched",
        StudentsDetails: StudentsDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const updateStudentByStudentIDSchoolID = async (req, res, next) => {
  const { studentID, schoolID } = req.params;
console.log(req.body)
  try {
    const StudentDetails = await prisma.student.update({
      where: {
        studentID: studentID,
        schoolID: schoolID,
      },
      data: {
        ...req.body,
      },
    });

   
    res.status(201).json({
      message: "Student Details Updated Successfully",
      StudentsDetails: StudentDetails,
    });
  } catch (error) {

    if (error.code === "P2025") {
      // Handle the case where the record to update is not found
      res.status(404).json({
        success: false,
        message: "Student not found with the given ID and School ID",
      });
      return null; // Return null to prevent Prisma from retrying
    }
    next(error);

    
  }
};

// // get student details
// export const getStudentDetailsBySchoolIDStudentID = async (req, res, next) => {
//   const { schoolID, studentID } = req.params;

//   try {
//     const StudentDetails = await Student.find({
//       schoolID,
//       studentID,
//     });
//     if (StudentDetails.length === 0) {
//       next(errorHandler(401, "Student Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Student Details Fetched",
//         StudentDetails: StudentDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// // get all student details
// export const getAllStudentDetails = async (req, res, next) => {
//   const { schoolID } = req.params;

//   try {
//     const StudentsDetails = await Student.find({
//       schoolID: schoolID,
//     });
//     if (StudentsDetails.length === 0) {
//       next(errorHandler(401, "Students Details Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Students Details Fetched",
//         StudentsDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// //delete Student  by school id and studentID
// export const deleteStudent = async (req, res, next) => {
//   const { schoolID, studentID } = req.params;
//   // console.log(req.params);

//   try {
//     const StudentsDetails = await Student.deleteOne({
//       schoolID,
//       studentID,
//     });
//     if (StudentsDetails.deletedCount === 0) {
//       next(errorHandler(401, "Student Details Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Student Details Deleted Successfully",
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };
