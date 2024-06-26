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
    gradeID,
    classType,
    createdBy,
    lastModifiedBy,
  } = req.body;

  try {
    const StudentGradeID = await prisma.studentGrade.findFirst({
      where: {
        AND: [
          { schoolID: schoolID },
          { studentID: studentID },
          { gradeID: gradeID },
        ],
      },
      select: {
        id: true,
      },
    });
    // console.log(StudentGradeID);
    if (!StudentGradeID) {
      return next(
        errorHandler(401, `Student not found in the selected grade.`)
      );
    }

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

    const marksExist = await prisma.marks.findFirst({
      where: {
        AND: [
          { schoolID: schoolID },
          { studentID: studentID },
          { term: term },
          { gradeID: gradeID },
          { studentGradeID: StudentGradeID.id },
        ],
      },
    });

    if (marksExist) {
      return next(errorHandler(401, "Marks already exists"));
    } else {
      const newMarks = await prisma.marks.create({
        data: {
          schoolID,
          studentID,
          subjectMarks,
          term,
          stream,
          gradeID,
          studentGradeID: StudentGradeID.id,
          classType,
          createdBy,
          lastModifiedBy,
        },
      });

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
        grade: true,
        student: true,
      },
    });

    if (marks.length === 0) {
      return next(errorHandler(401, "Marks not found"));
    }

    // // Modify the structure of each mark object in place
    // marks.forEach((mark) => {
    //   mark.grade = mark.grade.gradeLevel; // Replacing grade object with gradeLevel string
    // });

    return res.status(201).json({
      message: "All school student marks details Fetched",
      studentMarksDetails: marks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMarks = async (req, res, next) => {
  const { schoolID, studentID, id } = req.params;

  const { subjectMarks, term, stream, gradeID, classType } = req.body;

  try {
    const StudentGradeID = await prisma.studentGrade.findFirst({
      where: {
        AND: [
          { schoolID: schoolID },
          { studentID: studentID },
          { gradeID: gradeID },
        ],
      },
      select: {
        id: true,
      },
    });
    // console.log(StudentGradeID);
    if (!StudentGradeID) {
      return next(
        errorHandler(401, `Student not found in the selected grade.`)
      );
    }

    // Check for  marks ID available
    const existingMarks = await prisma.marks.findMany({
      where: {
        AND: [{ schoolID: schoolID }, { studentID: studentID }, { id: id }],
      },
    });

    if (existingMarks.length === 0) {
      return next(errorHandler(401, "Marks not found"));
    }

    // Check for duplicate Marks
    const marksExist = await prisma.marks.findFirst({
      where: {
        AND: [
          { schoolID: schoolID },
          { studentID: studentID },
          { term: term },
          { gradeID: gradeID },
          { studentGradeID: StudentGradeID.id }, // academic year or promoted grade
        ],
        NOT: {
          id: id,
        },
      },
    });

    if (marksExist) {
      return next(errorHandler(401, "Student Marks already exist"));
    }

    const updatedMarks = await prisma.marks.updateMany({
      where: {
        AND: [
          { schoolID: schoolID },
          { id: id },
          { studentID: studentID },
          { studentGradeID: StudentGradeID.id },
          { gradeID: gradeID },
        ],
      },
      data: {
        schoolID,
        studentID,
        subjectMarks,
        term,
        stream,
        gradeID,
        studentGradeID: StudentGradeID.id,
        classType,
      },
    });
    res.status(201).json({
      message: "Marks updated successfully",
    });
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
      return next(errorHandler(401, "Marks not found"));
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
    // Find the grade details for the given grade
    const gradeDetails = await prisma.grade.findFirst({
      where: {
        gradeLevel: grade,
      },
    });

    if (!gradeDetails) {
      return next(errorHandler(401, "Grade not found"));
    }
    // --

    // Find the academic year for the given schoolID and grade and studentID
    const FindAcademicYear = await prisma.studentGrade.findFirst({
      where: {
        AND: [
          { schoolID: schoolID },
          { gradeID: gradeDetails.id },
          { studentID: studentID },
        ],
      },
      select: { academicYear: true },
    });

    if (!FindAcademicYear) {
      return next(errorHandler(401, "Student marks not found")); // student not found in the selected grade
    }
    //

    // // Find all marks for the given schoolID, grade, and term and academicYear to calculate rank other
    const AllMarks = await prisma.marks.findMany({
      where: {
        AND: [
          { schoolID: schoolID },
          { gradeID: gradeDetails.id },
          { term: term },
          { studentGrade: { academicYear: FindAcademicYear.academicYear } },
        ],
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

    if (AllMarks.length === 0) {
      return next(errorHandler(401, "Student marks not found"));
    }
    //--

    // Find all marks particular studentID
    const studentMarks = AllMarks.filter(
      (mark) => mark.studentID === studentID
    );
    if (studentMarks.length === 0) {
      return next(errorHandler(401, "Student marks not found"));
    }
    // Find all marks particular studentID

    // // Find all subjects
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
          category: subjectDetail ? subjectDetail.category : "Unknown",
        };
      });

      // Calculate TotalMarks
      const totalMarks = mark.subjectMarks.reduce((total, subjectMark) => {
        // Convert subjectMark.marks to a number; if it's not valid or NaN, default to 0
        const marks = Number(subjectMark.marks) || 0;

        return total + marks;
      }, 0);

      return {
        ...mark,
        subjectMarks: enrichedSubjectMarks,
        TotalMarks: totalMarks,
        AverageMarks: parseFloat(
          (totalMarks / enrichedSubjectMarks.length).toFixed(2)
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
    const RankOneStudent = enrichedMarks.filter((mark) => mark.Rank === 1);
    const SearchedStudent = enrichedMarks.filter(
      (student) => student.studentID === studentID
    );

    // order the subject marks by subjectID and category
    const sortSubjectsByIDAndCategory = (students) => {
      students.forEach((student) => {
        student.subjectMarks.sort((a, b) => {
          // Compare by subjectID first
          const idComparison = a.subjectID.localeCompare(b.subjectID);

          // If subjectID is the same, then compare by category
          if (idComparison === 0) {
            return a.category - b.category;
          }

          return idComparison;
        });
      });
    };

    // Example usage:
    sortSubjectsByIDAndCategory(SearchedStudent);
    sortSubjectsByIDAndCategory(RankOneStudent);
    // order the subject marks by subjectID and category

    // take highest
    function getHighestMarks(marksDetails) {
      let highestMarks = {};

      // Iterate over each student's marks
      marksDetails.forEach((student) => {
        student.subjectMarks.forEach((subject) => {
          // Convert subject.marks to a number; if it's not valid, default to 0
          const marks = Number(subject.marks) || 0;

          // Update highestMarks if current subject marks are higher
          if (
            !highestMarks[subject.subjectID] ||
            marks > highestMarks[subject.subjectID].marks
          ) {
            highestMarks[subject.subjectID] = {
              subjectID: subject.subjectID,
              marks: marks,
              subjectName: subject.subjectName,
              category: subject.category,
            };
          }
        });
      });

      return highestMarks;
    }

    // Call the function to get highest marks
    // compare both and return the highest
    const highestMarks = getHighestMarks(enrichedMarks);

    //Take only the highest marks in search student subjects
    // Filter highestMarks to match the searchedStudent's subjects
    const filteredHighestMarks = SearchedStudent[0].subjectMarks.reduce(
      (result, subject) => {
        if (highestMarks[subject.subjectID]) {
          result[subject.subjectID] = highestMarks[subject.subjectID];
        }
        return result;
      },
      {}
    );
    //Take only the highest marks in search student subjects

    if (SearchedStudent.length === 0) {
      return next(errorHandler(401, "Marks not found"));
    }
    return res.status(200).json({
      message: "Marks details fetched",
      marksDetails: {
        SearchedStudent: SearchedStudent,
        RankOneStudent: RankOneStudent,
        highestMarks: filteredHighestMarks,
      },
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
      return next(errorHandler(401, "Marks not found"));
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
