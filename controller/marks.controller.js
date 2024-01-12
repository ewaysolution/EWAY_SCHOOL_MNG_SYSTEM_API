import mongoose from "mongoose";
import Marks from "../modal/marks.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

export const getAllSchoolMarks = async (req, res, next) => {
  try {
    const marks = await Marks.find();
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
      next(
        errorHandler(
          401,
          `Information regarding the academic marks for student ID ${studentID} is currently unavailable.`
        )
      );
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
      next(
        errorHandler(
          401,
          `Information regarding the academic marks for student index ${studentID} is currently unavailable.`
        )
      );
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

export const getMarkBySchoolID = async (req, res, next) => {
  const { schoolID } = req.params;

  try {
    const marks = await Marks.aggregate([
      {
        $match: { schoolID: schoolID },
      },
      {
        $unwind: "$subjectResults",
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectResults.subjectID",
          foreignField: "subjectID",
          as: "subjectDetails",
        },
      },
      {
        $unwind: "$subjectDetails",
      },
      {
        $lookup: {
          from: "students",
          localField: "studentID",
          foreignField: "studentID",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails",
      },
      {
        $group: {
          _id: "$_id",
          schoolID: { $first: "$schoolID" },
          studentID: { $first: "$studentID" },
          term: { $first: "$term" },
          grade: { $first: "$grade" },
          stream: { $first: "$stream" },
          classType: { $first: "$classType" },
          createdBy: { $first: "$createdBy" },
          lastModifiedBy: { $first: "$lastModifiedBy" },
          active: { $first: "$active" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          subjectResults: {
            $push: {
              subjectID: "$subjectResults.subjectID",
              marks: "$subjectResults.marks",
              subjectName: "$subjectDetails.subjectName",
            },
          },
          studentDetails: {
            $first: "$studentDetails",
          },
        },
      },
      {
        $project: {
          "studentDetails.password": 0, // Exclude the 'password' field from studentDetails
        },
      },
    ]);

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
    stream,
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
      next(errorHandler(401, "Student Marks Already Exists"));
    } else {
      const newMarks = await Marks.create({
        schoolID: schoolID,
        studentID: studentID,
        stream: stream,
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

export const deleteMarks = async (req, res, next) => {
  try {
    const markIdString = req.params.id;

    // Check if the input is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(markIdString)) {
      return res.status(400).json({
        message: "Invalid ObjectId format",
      });
    }

    const markId = new mongoose.Types.ObjectId(markIdString);

    const response = await Marks.deleteOne({
      _id: markId,
    });

    if (response.deletedCount > 0) {
      // Successfully deleted
      res.status(200).json({
        message: "Marks Details Deleted Successfully",
      });
    } else {
      // Document not found, consider it deleted
      res.status(200).json({
        message: "Marks Details Not Found (considered deleted)",
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Error:", error.message);
    next(errorHandler(500, "Internal Server Error"));
  }
};


export const inActiveMarks = async (req, res, next) => {
  res.send("Hello");
};

export const updateMarks = async (req, res, next) => {
  res.send("Hello");
};
