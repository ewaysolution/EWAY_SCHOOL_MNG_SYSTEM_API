import mongoose from "mongoose";
import { errorHandler } from "../util/error.js";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

export const registerMarks = async (req, res, next) => {
  const {
    schoolID,
    studentID,
    subjectMarks,
    term,
    stream,
    grade,
    classType,
    createdBy,
    lastModifiedBy,
  } = req.body;

  try {
    const marksExist = await prisma.marks.findMany({
      where: {
        AND: [
          { schoolID: schoolID },
          { studentID: studentID },
          { term: term },
          { stream: stream },
          { grade: grade },
          { classType: classType },
        ],
      },
    });

    const subjectExists = [];
    marksExist.forEach((marks) => {
      marks.subjectMarks.forEach((subjectMark) => {
        // Check if the subject mark exists in the provided subjectMarks array
        const foundSubject = subjectMarks.find(
          (mark) => mark.subjectID === subjectMark.subjectID
        );
        if (foundSubject) {
          subjectExists.push(foundSubject.subjectID); // Push the subject ID to the subjectExists array
        }
      });
    });

    if (marksExist.length > 0 && subjectExists.length > 0) {
      next(
        errorHandler(
          401,
          `Following student marks ${subjectExists} already Exist`
        )
      );
    } else if (marksExist.length > 0) {
      next(errorHandler(401, `Student marks already exist`));
    } else {
      const newMarks = await prisma.marks.create({
        data: {
          schoolID,
          studentID,
          subjectMarks,
          term,
          stream,
          grade,
          classType,
          createdBy,
          lastModifiedBy,
        },
      });
      //   res.status(201).json(newSchool);
      res.status(201).json({
        message: "Student Marks Added Successfully",
        subjectMarks: newMarks,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllMarks = async (req, res, next) => {
 const { schoolID } = req.params;
  try {
    const marks = await prisma.marks.findMany(
      {
        where: {
          schoolID: schoolID
        }
      }
    );
    return res.status(201).json({
      message: "All school student marks details Fetched",
      studentMarksDetails: marks,
    });
  }
 catch (error) {
    next(error);
}
}
// export const getAllSchoolMarks = async (req, res, next) => {
//   try {
//     const marks = await Marks.find();
//     if (marks.length === 0) {
//       next(errorHandler(401, "No Student Marks in this system"));
//     } else {
//       return res.status(201).json({
//         message: "All school student marks details Fetched",
//         studentMarksDetails: marks,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// export const getMarks = async (req, res, next) => {
//   const { schoolID, studentID } = req.params;
//   try {
//     const marks = await Marks.find({
//       schoolID,
//       studentID,
//     });
//     if (marks.length === 0) {
//       next(
//         errorHandler(
//           401,
//           `Information regarding the academic marks for student ID ${studentID} is currently unavailable.`
//         )
//       );
//     } else {
//       return res.status(201).json({
//         message: "Student Marks Details Fetched",
//         studentMarksDetails: marks,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // get marks by
// export const getMarkBySchIDStdIDTermGrade = async (req, res, next) => {
//   const { schoolID, studentID, grade, term } = req.params;
//   try {
//     const marks = await Marks.find({
//       schoolID,
//       studentID,
//       grade,
//       term,
//     });
//     if (marks.length === 0) {
//       next(
//         errorHandler(
//           401,
//           `Information regarding the academic marks for student index ${studentID} is currently unavailable.`
//         )
//       );
//     } else {
//       res.status(201).json({
//         message: "Student Marks Details Fetched",
//         studentMarksDetails: marks,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// export const getMarkBySchoolID = async (req, res, next) => {
//   const { schoolID } = req.params;

//   try {
//     const marks = await Marks.aggregate([
//       {
//         $match: { schoolID: schoolID },
//       },
//       {
//         $unwind: "$subjectMarks",
//       },
//       {
//         $lookup: {
//           from: "subjects",
//           localField: "subjectMarks.subjectID",
//           foreignField: "subjectID",
//           as: "subjectDetails",
//         },
//       },
//       {
//         $unwind: "$subjectDetails",
//       },
//       {
//         $lookup: {
//           from: "students",
//           localField: "studentID",
//           foreignField: "studentID",
//           as: "studentDetails",
//         },
//       },
//       {
//         $unwind: "$studentDetails",
//       },
//       {
//         $group: {
//           _id: "$_id",
//           schoolID: { $first: "$schoolID" },
//           studentID: { $first: "$studentID" },
//           term: { $first: "$term" },
//           grade: { $first: "$grade" },
//           stream: { $first: "$stream" },
//           classType: { $first: "$classType" },
//           createdBy: { $first: "$createdBy" },
//           lastModifiedBy: { $first: "$lastModifiedBy" },
//           active: { $first: "$active" },
//           createdAt: { $first: "$createdAt" },
//           updatedAt: { $first: "$updatedAt" },
//           subjectMarks: {
//             $push: {
//               subjectID: "$subjectMarks.subjectID",
//               marks: "$subjectMarks.marks",
//               subjectName: "$subjectDetails.subjectName",
//             },
//           },
//           studentDetails: {
//             $first: "$studentDetails",
//           },
//         },
//       },
//       {
//         $project: {
//           "studentDetails.password": 0, // Exclude the 'password' field from studentDetails
//         },
//       },
//     ]);

//     if (marks.length === 0) {
//       next(errorHandler(401, "Student Marks Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Student Marks Details Fetched",
//         studentMarksDetails: marks,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// export const deleteMarks = async (req, res, next) => {
//   try {
//     const markIdString = req.params.id;

//     // Check if the input is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(markIdString)) {
//       return res.status(400).json({
//         message: "Invalid ObjectId format",
//       });
//     }

//     const markId = new mongoose.Types.ObjectId(markIdString);

//     const response = await Marks.deleteOne({
//       _id: markId,
//     });

//     if (response.deletedCount > 0) {
//       // Successfully deleted
//       res.status(200).json({
//         message: "Marks Details Deleted Successfully",
//       });
//     } else {
//       // Document not found, consider it deleted
//       res.status(200).json({
//         message: "Marks Details Not Found (considered deleted)",
//       });
//     }
//   } catch (error) {
//     // Handle unexpected errors
//     console.error("Error:", error.message);
//     next(errorHandler(500, "Internal Server Error"));
//   }
// };

// export const inActiveMarks = async (req, res, next) => {
//   res.send("Hello");
// };

// export const updateMarks = async (req, res, next) => {
//   res.send("Hello");
// };
