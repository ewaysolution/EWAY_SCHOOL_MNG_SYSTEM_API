import { generateApiKey } from "generate-api-key";
import Student from "../modal/student.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

export const registerStudent = async (req, res, next) => {
  const { studentID, password } = req.body;

  try {
    const studentDetails = await Student.find({ studentID });

    if (studentDetails && studentDetails.length > 0) {
      next(errorHandler(401, "Student Already Exists"));
    } else {
      req.body.apiKey = generateApiKey({ method: "bytes" }) + "_" + teacherID;
      req.body.password = bcryptjs.hashSync(password, 10);
      const newStudent = await Student.create(req.body);
      res.status(201).json(newStudent);
    }
  } catch (error) {
    next(error);
  }
};
