import Marks from "../modal/marks.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";


export const getAllSchoolMarks = async (req, res, next) => {
    try {
      const marks = await Marks.find()
      if (marks.length === 0) {
        next(errorHandler(401, "No Student Marks in this system"));
      } else {
        return res.status(201).json({
          message: "All school student marks details Fetched",
          studentMarksDetails: marks,
        });
      }
    } catch (error) {
      next(error);
    }
  };


export const getMarks = async (req, res, next) => {
  const { schoolID, studentID } = req.params;
  try {
    const marks = await Marks.find({
      schoolID,
      studentID,
    });
    if (marks.length === 0) {
      next(errorHandler(401, "Student Marks Not Found"));
    } else {
      return res.status(201).json({
        message: "Student Marks Details Fetched",
        studentMarksDetails: marks,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get marks by
export const getMarkBySchIDStdIDTermGrade = async (req, res, next) => {
  const { schoolID, studentID, grade, term } = req.params;
  try {
    const marks = await Marks.find({
      schoolID,
      studentID,
      grade,
      term,
    });
    if (marks.length === 0) {
      next(errorHandler(401, "Student Marks Not Found"));
    } else {
      res.status(201).json({
        message: "Student Marks Details Fetched",
        studentMarksDetails: marks,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const addMarks = async (req, res, next) => {
  const {
    schoolID,
    studentID,
    subjectResults,
    term,
    grade,
    classType,
    createdBy,
    lastModifiedBy,
  } = req.body;

  try {
    const marksExits = await Marks.findOne({
      schoolID: schoolID,
      studentID: studentID,
      term: term,
      grade: grade,
    });
    if (marksExits) {
      next(errorHandler(401, "Marks Already Exists"));
    } else {
      const newMarks = await Marks.create({
        schoolID: schoolID,
        studentID: studentID,
        stream: "maths",
        term: term,
        grade: grade,
        classType: classType,
        subjectResults: subjectResults,
        createdBy: createdBy,
        lastModifiedBy: lastModifiedBy,
      });
      //   res.status(201).json(newSchool);
      res.status(201).json({
        message: "Student Marks Added Successfully",
        subjectResults: newMarks,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMarks = async (req, res, next) => {
  res.send("Hello");
};

export const deleteMarks = async (req, res, next) => {
  res.send("Hello");
};

export const inActiveMarks = async (req, res, next) => {
  res.send("Hello");
};
