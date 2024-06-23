import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const registerTeacher = async (req, res, next) => {
  console.log(req.body);
  const {
    schoolID,
    teacherID,
    password,
    avatar,
    medium,
    name,
    gender,
    religion,
    DOB,
    nic,
    email,
    marriageStatus,
    userType,
    shortBIO,
    active,
  } = req.body;

  try {
    const teacherDetails = await prisma.teacher.findMany({
      where: {
        AND: [{ teacherID: teacherID }, { nic: nic }, { email: email }],
      },
    });

    if (teacherDetails && teacherDetails.length > 0) {
      next(errorHandler(401, "Teacher Already Exists"));
    } else {
      req.body.password = bcryptjs.hashSync(password, 10);

      const newTeacher = await prisma.teacher.create({
        data: {
          teacherID: req.body.teacherID,
          password: req.body.password,
          avatar: req.body.avatar,
          medium: req.body.medium,
          initial: req.body.initial,
          marriageStatus: req.body.marriageStatus,
          fname: req.body.fname,
          lname: req.body.lname,
          fullName: req.body.fullName,
          gender: req.body.gender,
          religion: req.body.religion,
          DOB: req.body.DOB,
          nic: req.body.nic,
          residentialAddress: req.body.residentialAddress,
          permanentAddress: req.body.permanentAddress,
          mobile: req.body.mobile,
          home: req.body.home,
          email: req.body.email,
          userType: req.body.userType,
          shortBIO: req.body.shortBIO,
          active: req.body.active,
          schoolID: req.body.schoolID,
        },
      });

      res.status(201).json({
        message: "Successfully registered",
        teacherDetails: newTeacher,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const teacherDetails = await prisma.teacher.findMany({
      where: {
        teacherID: req.params.teacherID,
      },
      select: {
        teacherID: true,
        password: true,
        avatar: true,
        medium: true,
        initial: true,
        fname: true,
        lname: true,
        fullName: true,
        gender: true,
        religion: true,
        DOB: true,
        NIC: true,
        marriageStatus: true,
        residentialAddress: true,
        permanentAddress: true,
        mobile: true,
        home: true,
        email: true,
        userType: true,
        shortBIO: true,
        schoolID: true,
        school: {
          select: {
            name: true,
            schoolID: true,
            apiKey: true,
          },
        },
        subjects: true,
      },
      // include: {
      //   subjects: true, // Include related SubjectTaken data
      //   school: true,
      // },
    });
    if (teacherDetails.length === 0) {
      return next(errorHandler(401, "No teachers registered"));
    } else {
      res.status(201).json({
        message: "Get Teacher Details Successfully",
        teachers: teacherDetails,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const subjectTaken = async (req, res, next) => {
  const { subjectID, teacherID, schoolID, grade } = req.body;

  try {
    const subTaken = await prisma.SubjectTaken.findMany({
      where: {
        AND: [
          { subjectID: subjectID },
          { teacherID: teacherID },
          { schoolID: schoolID },
        ],
      },
    });

    // If email or contact already exists, return an error
    if (subTaken.length > 0) {
      return next(errorHandler(401, `Subject already assigned to him`));
    }

    const SubjectTakenDetails = await prisma.SubjectTaken.create({
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Subject assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTeacherBySchoolID = async (req, res, next) => {
  try {
    const teachersDetails = await prisma.teacher.findMany({
      where: {
        schoolID: req.params.schoolID,
      },
    });
    if (teachersDetails.length === 0) {
      return next(errorHandler(401, "No teachers registered yet"));
    } else {
      res.status(201).json({
        message: "Get Teacher Details Successfully",
        teachers: teachersDetails,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateTeacherByTeacherSchoolID = async (req, res, next) => {
  try {
    const { schoolID, teacherID } = req.params;
    const TeacherDetails = await prisma.teacher.update({
      where: {
        teacherID: teacherID,
        schoolID: schoolID,
      },

      data: req.body,
    });

    res.status(201).json({
      message: "Teacher Details Updated Successfully",
      TeacherDetails: TeacherDetails,
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle the case where the record to update is not found
      res.status(404).json({
        success: false,
        message: "Teacher not found with the given ID and School ID",
      });
      return null; // Return null to prevent Prisma from retrying
    }
    next(error);
  }
}; 