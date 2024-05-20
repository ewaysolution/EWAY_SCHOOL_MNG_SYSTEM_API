import { PrismaClient } from "@prisma/client";

import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient();
export const subjectRegister = async (req, res, next) => {
 
  const { subjectID, name, grade } = req.body;

  try {
    const existingSubject = await prisma.Subject.findMany({
      where: {
        subjectID: subjectID,
      },
    });

    // If email or contact already exists, return an error
    if (existingSubject.length > 0) {
      res.status(400).json({
        success: false,
        message: "Subject already exists",
      });
      return;
    }

    console.log(req.body);
    const subjectDetails = await prisma.Subject.create({
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Subject registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// export const getSubjectBySubjectID = async (req, res, next) => {
//   const { subjectID } = req.params;
//   console.log(req.params);
//   try {
//     const subjectDetails = await Subject.find({
//       subjectID,
//     });
//     if (subjectDetails.length === 0) {
//       next(errorHandler(401, "Subject Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Subject Details Fetched",
//         subjectDetails: subjectDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };

// export const getAllSubjects = async (req, res, next) => {
//   try {
//     const subjectDetails = await Subject.find();

//     if (subjectDetails.length === 0) {
//       next(errorHandler(401, "Subject Not Found"));
//     } else {
//       res.status(201).json({
//         message: "Subject Details Fetched",
//         subjectDetails: subjectDetails,
//       });
//     }
//   } catch (error) {
//     next(error.message);
//   }
// };
