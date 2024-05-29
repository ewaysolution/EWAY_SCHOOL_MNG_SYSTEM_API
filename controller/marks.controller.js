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
    // Check for duplicate subject IDs in the provided subjectMarks array
    const uniqueSubjectIDs = new Set();
    for (const subjectMark of subjectMarks) {
      if (uniqueSubjectIDs.has(subjectMark.subjectID)) {
        return next(
          errorHandler(
            400,
            `Duplicate subject ID found: ${subjectMark.subjectID}`
          )
        );
      }
      uniqueSubjectIDs.add(subjectMark.subjectID);
    }
    // ----------------------

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

    if (marksExist.length > 0) {
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
    const marks = await prisma.marks.findMany({
      where: {
        schoolID: schoolID,
      },
      include: {
        student: true,
      },
    });
    return res.status(201).json({
      message: "All school student marks details Fetched",
      studentMarksDetails: marks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMarks = async (req, res, next) => {
  console.log(req.params);
  const { schoolID, studentID, id } = req.params;
  const { subjectMarks, term, stream, grade, classType } = req.body;
  try {
    const existingMarks = await prisma.marks.findMany({
      where: {
        AND: [{ schoolID: schoolID }, { studentID: studentID }, { id: id }],
      },
    });
    if (existingMarks.length === 0) {
      next(errorHandler(401, "Marks not found"));
    } else {
      const updatedMarks = await prisma.marks.updateMany({
        where: {
          AND: [{ schoolID: schoolID }, { id: id }, { studentID: studentID }],
        },
        data: req.body,
      });
      res.status(201).json({
        message: "Marks updated successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMarks = async (req, res, next) => {
  const { schoolID, studentID, id } = req.params;
  try {
    const existingMarks = await prisma.marks.findMany({
      where: {
        AND: [{ schoolID: schoolID }, { studentID: studentID }, { id: id }],
      },
    });
    if (existingMarks.length === 0) {
      next(errorHandler(401, "Marks not found"));
    }

    const deletedMarks = await prisma.marks.deleteMany({
      where: {
        AND: [{ schoolID: schoolID }, { id: id }, { studentID: studentID }],
      },
    });
    res.status(201).json({
      message: "Marks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMarksByStudentIDGradeTerm = async (req, res, next) => {
  const { schoolID, studentID, grade, term } = req.params;
  try {
    // Find all marks for the given schoolID, grade, and term
    const AllMarks = await prisma.marks.findMany({
      where: {
        AND: [{ schoolID: schoolID }, { grade: grade }, { term: term }],
      },
      select: {
        subjectMarks: true,
        term: true,
        stream: true,
        grade: true,
        classType: true,
        schoolID: true,
        studentID: true,
        school: {
          select: {
            name: true,
            avatar: true,
            contact: { select: { phone: true, email: true } },
          },
        },
        student: { select: { fullName: true, avatar: true } },
      },
    });

    // Find all subjects
    const subjectDetails = await prisma.subject.findMany();

    // Enrich subjectMarks with subject names
    const enrichedMarks = AllMarks.map((mark) => {
      const enrichedSubjectMarks = mark.subjectMarks.map((subjectMark) => {
        const subjectDetail = subjectDetails.find(
          (detail) => detail.subjectID === subjectMark.subjectID
        );
        return {
          ...subjectMark,
          subjectName: subjectDetail ? subjectDetail.name : "Unknown",
        };
      });
      return {
        ...mark,
        subjectMarks: enrichedSubjectMarks,
        TotalMarks: enrichedSubjectMarks.reduce(
          (total, subjectMark) => total + subjectMark.marks,
          0
        ),
        AverageMarks: parseFloat(
          (
            enrichedSubjectMarks.reduce(
              (total, subjectMark) => total + subjectMark.marks,
              0
            ) / enrichedSubjectMarks.length
          ).toFixed(2)
        ),
      };
    });

    // Sort students by TotalMarks in descending order
    enrichedMarks.sort((a, b) => b.TotalMarks - a.TotalMarks);

    // Assign ranks to students
    let currentRank = 1;
    let previousTotalMarks = null;
    enrichedMarks.forEach((mark, index) => {
      if (previousTotalMarks !== mark.TotalMarks) {
        currentRank = index + 1; // Assign current index + 1 as rank
        previousTotalMarks = mark.TotalMarks;
      }
      mark.Rank = currentRank; // Add rank to the student’s mark object
    });

    // Filter the student(s) with rank 1
    const RankOneStudents = enrichedMarks.filter((mark) => mark.Rank === 1);
    const SearchedStudent = enrichedMarks.filter(
      (student) => student.studentID === studentID
    );

    if (SearchedStudent.length === 0) {
      next(errorHandler(401, "Marks not found"));
    }
    return res.status(200).json({
      message: "Marks details fetched",
      marksDetails: { SearchedStudent, RankOneStudents },
    });
  } catch (error) {
    next(error);
  }
};

export const getMarksByGradeTerm = async (req, res, next) => {
  const { schoolID, grade, term } = req.params;
  try {
    const marks = await prisma.marks.findMany({
      where: {
        AND: [{ schoolID: schoolID }, { grade: grade }, { term: term }],
      },
      select: {
        subjectMarks: true,
        term: true,
        stream: true,
        grade: true,
        classType: true,
        schoolID: true,
        studentID: true,
        school: {
          select: {
            name: true,
            avatar: true,
            contact: { select: { phone: true, email: true } },
          },
        },
        student: { select: { fullName: true, avatar: true } },
      },
    });

    if (marks.length === 0) {
      next(errorHandler(401, "Marks not found"));
    }

    // Calculate total marks, average marks, and place for each student
    const studentMarksDetails = marks.map((mark) => {
      const totalMarks = mark.subjectMarks.reduce(
        (total, subject) => total + subject.marks,
        0
      );
      const averageMarks = parseFloat(
        (totalMarks / mark.subjectMarks.length).toFixed(2)
      );

      return {
        ...mark,
        totalMarks,
        averageMarks,
      };
    });

    // Sort students by total marks to assign places
    studentMarksDetails.sort((a, b) => b.totalMarks - a.totalMarks);
    studentMarksDetails.forEach((student, index) => {
      student.place = index + 1;
    });

    // Fetch subject details
    const subjectDetails = await prisma.subject.findMany();

    // Enrich the subject marks with subject names
    const enrichedMarks = studentMarksDetails.map((mark) => {
      const enrichedSubjectMarks = mark.subjectMarks.map((subjectMark) => {
        const subjectDetail = subjectDetails.find(
          (detail) => detail.subjectID === subjectMark.subjectID
        );
        return {
          ...subjectMark,
          subjectName: subjectDetail ? subjectDetail.name : "Unknown",
        };
      });
      return {
        ...mark,
        subjectMarks: enrichedSubjectMarks,
      };
    });

    return res.status(201).json({
      message: "Student marks details Fetched",
      studentMarksDetails: enrichedMarks,
    });
  } catch (error) {
    next(error);
  }
};

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
