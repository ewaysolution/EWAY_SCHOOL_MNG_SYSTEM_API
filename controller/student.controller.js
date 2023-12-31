import { generateApiKey } from "generate-api-key";
import Student from "../modal/student.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

// register student
export const registerStudent = async (req, res, next) => {
  const { studentID, password, schoolID, admissionNo, NIC } = req.body;

  try {
    const nicNo = NIC ? NIC.NICNo : null;
    const studentDetails = await Student.find({
      $or: [{ studentID }, { admissionNo }, { "NIC.NICNo": nicNo }],
      $and: [{ schoolID }],
    });

    if (studentDetails && studentDetails.length > 0) {
      next(errorHandler(401, "Student Already Exists"));
    } else {
      req.body.password = bcryptjs.hashSync(password, 10);
      const newStudent = await Student.create(req.body);
      res.status(201).json({
        message: "Student registered successfully",
        StudentDetails: newStudent,
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
      schoolID: "001",
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
  console.log(req.params)

  try {
    const StudentsDetails = await Student.deleteOne({
      schoolID,
      studentID,
    });
    if (StudentsDetails.deletedCount === 0) {
      next(errorHandler(401, "Students Details Not Found"));
    } else {
      res.status(201).json({
        message: "Students Details Deleted Successfully",
      });
    }
  } catch (error) {
    next(error.message);
  }
};
