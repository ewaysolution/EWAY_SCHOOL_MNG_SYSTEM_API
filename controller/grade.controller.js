import { PrismaClient } from "@prisma/client";

import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient();
export const gradeRegister = async (req, res, next) => {
  const grades = req.body; // Assuming the request body contains an array of grades

  try {
    // Iterate over the provided grades and check if they already exist
    const existingGrades = await prisma.grade.findMany({
      where: {
        gradeLevel: {
          in: grades.map((grade) => grade.gradeLevel),
        },
      },
    });

    if (existingGrades.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Grade(s) already exist: ${existingGrades
          .map((grade) => grade.gradeLevel)
          .join(", ")}`,
      });
    }

    // Insert all grades at once since none of them are duplicates
    const GradeDetails = await prisma.grade.createMany({
      data: grades,
    });

    res.status(201).json({
      success: true,
      message: "Grades Registered Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGrade = async (req, res, next) => {
  try {
    const gradeDetails = await prisma.grade.findMany();

    res.status(201).json({
      message: "Grade Details Fetched",
      gradeDetails: gradeDetails,
    });
  } catch (error) {
    next(error.message);
  }
};

export const regStudentPromotion = async (req, res, next) => {
  const StudentPromotionData = req.body; // Assuming the request body contains an array of grades

  try {
    // Iterate over the provided grades and check if they already exist
    const existingGrades = await prisma.StudentGrade.findMany({
      where: {
        AND: [
          {
            gradeID: {
              in: StudentPromotionData.map((data) => data.gradeID),
            },
            studentID: {
              in: StudentPromotionData.map((data) => data.studentID),
            },
            academicYear: {
              in: StudentPromotionData.map((data) => data.academicYear),
            },
            schoolID: {
              in: StudentPromotionData.map((data) => data.schoolID),
            },
          },
        ],
      },
    });

    if (existingGrades.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Following promotion(s) already exist`,
        existingGrades: existingGrades,
      });
    }

    // Insert all grades at once since none of them are duplicates
    const StudentGrade = await prisma.StudentGrade.createMany({
      data: StudentPromotionData,
    });

    res.status(201).json({
      success: true,
      message: "StudentPromotion Registered Successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getStudentPromotion = async (req, res, next) => {

  try {
    const StudentGradeDetails = await prisma.StudentGrade.findMany();

    res.status(201).json({
      message: "StudentGrade Details Fetched",
      StudentGradeDetails: StudentGradeDetails,
    });

  } catch (error) {
    next(error);
  }
};

// export const getSubjectBySubjectID = async (req, res, next) => {
//   const { subjectID } = req.params;
//   console.log(req.params);
//   try {
//     const subjectDetails = await Subject.find({
//       subjectID,
//     });
//     if (subjectDetails.length === 0) {
//       next(errorHandler(401, "Subject Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Subject Details Fetched",
//         subjectDetails: subjectDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// export const getAllgrades = async (req, res, next) => {
//   try {
//     const subjectDetails = await Subject.find();

//     if (subjectDetails.length === 0) {
//       next(errorHandler(401, "Subject Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Subject Details Fetched",
//         subjectDetails: subjectDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };