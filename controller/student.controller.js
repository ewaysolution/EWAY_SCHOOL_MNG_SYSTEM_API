import { generateApiKey } from "generate-api-key";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// register student
export const registerStudent = async (req, res, next) => {
  const studentsData = req.body;
 

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
      return next(errorHandler(401, "Students already exist"));
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
      return  next(errorHandler(401, "Student Not Found"));
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
        grade: true,
      },
    });
    const grade = await prisma.grade.findMany();
    const studentGrade = await prisma.studentGrade.findMany();

    const enrichedGradeData = grade.map((gradeItem) => {
      const enrichedGrade = studentGrade.find(
        (stdGrade) => stdGrade.gradeID === gradeItem.id
      );
      const gradeLevel = enrichedGrade ? gradeItem.gradeLevel : null;

      return {
        ...gradeItem,
        gradeLevel: gradeLevel,
      };
    });

    const enrichedStudentData = StudentsDetails.map((student) => {
      // Step 1: Filter grades by studentID
      const studentGrades = studentGrade.filter(
        (stdGrade) => stdGrade.studentID === student.studentID
      );

      // Step 2: Enrich grades with grade details
      const enrichedGrades = studentGrades.map((grade) => {
        const gradeDetail = enrichedGradeData.find(
          (detail) => detail.id === grade.gradeID
        );
        return {
          ...grade,
          gradeLevel: gradeDetail ? Number(gradeDetail.gradeLevel) : -1,
          academicYear: Number(grade.academicYear), // Ensure academicYear is a number
        };
      });

      // console.log(enrichedGrades);

      // Step 3: Find the highest grade level
      const highestGrade = enrichedGrades.reduce(
        (max, grade) => (grade.gradeLevel > max.gradeLevel ? grade : max),
        { gradeLevel: -1, academicYear: "Unknown" }
      );

      // Step 4: Return the enriched student data
      return {
        ...student,
        grade:
          highestGrade.gradeLevel === -1 ? "Unknown" : highestGrade.gradeLevel,
        academicYear: highestGrade.academicYear,
      };
    });

    res.status(200).json({
      message: "Students Details Fetched",
      StudentsDetails: enrichedStudentData,
    });
  } catch (error) {
    next(error.message);
  }
};

export const updateStudentByStudentIDSchoolID = async (req, res, next) => {
  const { studentID, schoolID } = req.params;
  // console.log(req.body);
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
 