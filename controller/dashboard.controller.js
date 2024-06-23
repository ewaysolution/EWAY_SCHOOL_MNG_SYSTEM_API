import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient();

export const getDashboardElements = async (req, res, next) => {
  const { schoolID } = req.params;
  try {
    // Count active and inactive students
    const [totalStudents, activeStudents, inactiveStudents] = await Promise.all(
      [
        prisma.student.count({
          where: { schoolID: schoolID },
        }),
        prisma.student.count({
          where: {
            schoolID: schoolID,
            active: true,
          },
        }),
        prisma.student.count({
          where: {
            schoolID: schoolID,
            active: false,
          },
        }),
      ]
    );

    // Group by gender and count the number of students for each gender
    const studentGenderCount = await prisma.student.groupBy({
      by: ["gender"],
      where: {
        schoolID: schoolID,
      },
      _count: {
        gender: true,
      },
    });
    // Convert the genderCounts array to a more readable format
    const studentGender = studentGenderCount.reduce((acc, item) => {
      acc[item.gender] = item._count.gender;
      return acc;
    }, {});

    // Count active and inactive students
    const [totalTeachers, activeTeachers, inactiveTeachers] = await Promise.all(
      [
        prisma.teacher.count({
          where: { schoolID: schoolID },
        }),
        prisma.teacher.count({
          where: {
            schoolID: schoolID,
            active: true,
          },
        }),
        prisma.teacher.count({
          where: {
            schoolID: schoolID,
            active: false,
          },
        }),
      ]
    );

    // Group by gender and count the number of students for each gender
    const teacherGenderCount = await prisma.teacher.groupBy({
      by: ["gender"],
      where: {
        schoolID: schoolID,
      },
      _count: {
        gender: true,
      },
    });
    // Convert the genderCounts array to a more readable format
    const teacherGender = teacherGenderCount.reduce((acc, item) => {
      acc[item.gender] = item._count.gender;
      return acc;
    }, {});

    res
      .status(201)
      .json({
        totalStudents,
        activeStudents,
        inactiveStudents,
        studentGender,
        activeTeachers,
        totalTeachers,
        inactiveTeachers,
        teacherGender,
      });
  } catch (error) {
    console.error("Error counting students:", error);
  } finally {
    await prisma.$disconnect();
  }
};
