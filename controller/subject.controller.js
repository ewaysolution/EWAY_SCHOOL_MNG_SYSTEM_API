import { PrismaClient } from "@prisma/client";

import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient();
export const subjectRegister = async (req, res, next) => {
  const subjects = req.body; // Assuming the request body contains an array of subjects

  try {
    for (const subject of subjects) {
      const { subjectID, name, grade } = subject;

      const existingSubject = await prisma.Subject.findUnique({
        where: {
          subjectID: subjectID,
        },
      });

      // If subject already exists, return an error
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: `Subject with ID ${subjectID} already exists`,
        });
      }

   
      await prisma.Subject.create({
        data: {
          subjectID,
          name,
          grade,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Subjects registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const subjectDetails = await prisma.subject.findMany();

    res.status(201).json({
      message: "Subject Details Fetched",
      subjectDetails: subjectDetails,
    });
  } catch (error) {
    next(error.message);
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
