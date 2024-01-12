import { generateApiKey } from "generate-api-key";
import Student from "../modal/student.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

// register student
export const registerStudent = async (req, res, next) => {
  let studentsData = req.body;
  if (Array.isArray(req.body)) {
    // For multiple students
    studentsData = req.body;
  } else {
    // For a single student
    studentsData = [req.body];
  }

  const schoolID = studentsData[0].schoolID; // Assuming all students belong to the same school

  // Hash passwords for each student
  const hashedStudents = studentsData.map((student) => {
    const hashedPassword = bcryptjs.hashSync(student.password, 10);
    return { ...student, password: hashedPassword };
  });

  try {
    const existingStudents = await Student.find({
      $or: hashedStudents.map(({ studentID, admissionNo, NIC }) => ({
        $or: [{ studentID }, { admissionNo }, { "NIC.NICNo": NIC?.NICNo }],
      })),
      schoolID,
    });

    if (existingStudents && existingStudents.length > 0) {
      next(errorHandler(401, "One or more students already exist"));
    } else {
      const newStudents = await Student.insertMany(hashedStudents);

      res.status(201).json({
        message: "Students registered successfully",
        StudentsDetails: newStudents,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get student details
export const getStudentDetailsBySchoolIDStudentID = async (req, res, next) => {
  const { schoolID, studentID } = req.params;

  try {
    const StudentDetails = await Student.find({
      schoolID,
      studentID,
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

// get all student details
export const getAllStudentDetails = async (req, res, next) => {
  const { schoolID } = req.params;

  try {
    const StudentsDetails = await Student.find({
      schoolID: schoolID,
    });
    if (StudentsDetails.length === 0) {
      next(errorHandler(401, "Students Details Not Found"));
    } else {
      res.status(201).json({
        message: "Students Details Fetched",
        StudentsDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

//delete Student  by school id and studentID
export const deleteStudent = async (req, res, next) => {
  const { schoolID, studentID } = req.params;
  // console.log(req.params);

  try {
    const StudentsDetails = await Student.deleteOne({
      schoolID,
      studentID,
    });
    if (StudentsDetails.deletedCount === 0) {
      next(errorHandler(401, "Student Details Not Found"));
    } else {
      res.status(201).json({
        message: "Student Details Deleted Successfully",
      });
    }
  } catch (error) {
    next(error.message);
  }
};
