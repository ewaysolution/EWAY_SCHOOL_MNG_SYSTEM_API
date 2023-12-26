import Subject from "../modal/subject.modal.js";
import { errorHandler } from "../util/error.js";

export const subjectRegister = async (req, res, next) => {
  const { subjectID, subjectName } = req.body;

  try {
    const subjectDetails = await Subject.find({ subjectID });

    if (subjectDetails && subjectDetails.length > 0) {
      next(errorHandler(401, "subject Already Exists"));
    } else {
      const newSubject = await Subject.create(req.body);
      res.status(201).json(newSubject);
    }
  } catch (error) {
    next(error);
  }
};

export const getSubjectBySubjectID = async (req, res, next) => {
  const { subjectID } = req.params;
  console.log(req.params);
  try {
    const subjectDetails = await Subject.find({
      subjectID,
    });
    if (subjectDetails.length === 0) {
      next(errorHandler(401, "Subject Not Found"));
    } else {
      res.status(201).json({
        message: "Subject Details Fetched",
        subjectDetails: subjectDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const subjectDetails = await Subject.find()
 
    if (subjectDetails.length === 0) {
      next(errorHandler(401, "Subject Not Found"));
    } else {
      res.status(201).json({
        message: "Subject Details Fetched",
        subjectDetails: subjectDetails,
      });
    }
  } catch (error) {
    next(error.message);
  }
};
