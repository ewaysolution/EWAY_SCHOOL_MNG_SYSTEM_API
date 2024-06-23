import { PrismaClient } from "@prisma/client";

import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient();
export const subjectRegister = async (req, res, next) => {
  const subjects = req.body; // Assuming the request body contains an array of subjects

  try {
    for (const subject of subjects) {
      const { subjectID, name, grade, category } = subject;

      const existingSubject = await prisma.Subject.findUnique({
        where: {
          subjectID: subjectID,
        },
      });

      // If subject already exists, return an error
      if (existingSubject) {
        return next(
          errorHandler(401, `Subject with ID ${subjectID} already exists`)
        );
      }

      await prisma.Subject.create({
        data: {
          subjectID,
          name,
          grade,
          category,
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
