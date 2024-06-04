import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../util/error.js";
const prisma = new PrismaClient(); 

export const getDashboardElements = async (req, res, next) => {
  const { schoolID } = req.params;
  try {
    // Count active and inactive students
    const [totalStudents, activeStudents, inactiveStudents] = await Promise.all([
      prisma.student.count({
        where: { schoolID: schoolID }
      }),
      prisma.student.count({
        where: {
          schoolID: schoolID,
          active: true
        }
      }),
      prisma.student.count({
        where: {
          schoolID: schoolID,
          active: false
        }
      })
    ]);


      // Group by gender and count the number of students for each gender
    const genderCounts = await prisma.student.groupBy({
      by: ['gender'],
      where: {
        schoolID: schoolID
      },
      _count: {
        gender: true
      }
    });
      // Convert the genderCounts array to a more readable format
      const genderCountMap = genderCounts.reduce((acc, item) => {
        acc[item.gender] = item._count.gender;
        return acc;
      }, {});

     



    const TotalTeachers = await prisma.teacher.count({
      where: {
        schoolID: schoolID
      }
    });

 
 res.status(201).json({totalStudents, activeStudents,inactiveStudents,TotalTeachers, genderCountMap});
    
  } catch (error) {
    console.error('Error counting students:', error);
  } finally {
    await prisma.$disconnect();
  }
};