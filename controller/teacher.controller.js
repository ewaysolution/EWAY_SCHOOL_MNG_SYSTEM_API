import { generateApiKey } from "generate-api-key";
import Teacher from "../modal/teacher.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

export const registerTeacher = async (req, res, next) => {
  const { teacherID, password } = req.body;

  try {
    const teacherDetails = await Teacher.find({ teacherID });

    if (teacherDetails && teacherDetails.length > 0) {
      next(errorHandler(401, "Teacher Already Exists"));
    } else {
      req.body.apiKey = generateApiKey({ method: "bytes" }) + "_" + teacherID;
      req.body.password = bcryptjs.hashSync(password, 10);
      const newTeacher = await School.create(req.body);
      res.status(201).json(newTeacher);
    }
  } catch (error) {
    next(error);
  }
};
