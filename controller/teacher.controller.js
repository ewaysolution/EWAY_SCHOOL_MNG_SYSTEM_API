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
      // req.body.apiKey = generateApiKey({ method: "bytes" }) + "_" + teacherID;
      req.body.password = bcryptjs.hashSync(password, 10);
      const newTeacher = await Teacher.create(req.body);
      
      res.status(201).json({
        message: "Successfully registered",
        teacherDetails: newTeacher,
      });
    }
  } catch (error) {
    next(error);
  }
};



// get all Teacher details
export const getAllTeacherDetails = async (req, res, next) => {
  const { schoolID } = req.params;

  try {
    const TeacherDetails = await Teacher.find({
      schoolID: schoolID,
    });
    if (TeacherDetails.length === 0) {
      next(errorHandler(401, "Teacher Details Not Found"));
    } else {
      res.status(201).json({
        message: "Teacher Details Fetched",
        TeacherDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

// delete Teacher
export const deleteTeacher = async (req, res, next) => {
  const { schoolID, teacherID } = req.params;
  // console.log(req.params);

  try {
    const TeacherDetails = await Teacher.deleteOne({
      schoolID,
      teacherID,
    });
    if (TeacherDetails.deletedCount === 0) {
      next(errorHandler(401, "Teacher Details Not Found"));
    } else {
      res.status(201).json({
        message: "Teacher Details Deleted Successfully",
      });
    }
  } catch (error) {
    next(error.message);
  }
};




//
export const getTeacherWithSchoolDetails = async (req, res, next) => {
  console.log(req.params.teacherID)
  try {
    const teacherDetails = await Teacher.aggregate([
      {
        $match: {
          teacherID: req.params.teacherID,
        },
      },
      {
        $lookup: {
          from: 'schools', // Assuming your School collection is named 'schools'
          localField: 'schoolID',
          foreignField: 'schoolID',
          as: 'schoolDetails',
        },
      },
    ]);

    if (teacherDetails.length === 0) {
      return next(errorHandler(401, "Teacher Details Not Found"));
    }

    res.status(201).json({
      message: "Teacher Details Fetched",
      teacherDetails,
    });
  } catch (error) {
    next(error.message);
  }
};
