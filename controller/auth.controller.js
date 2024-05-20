import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const schoolLogin = async (req, res, next) => {
  const { schoolID, password } = req.body;
  try {
    const school = await prisma.school.findUnique({
      where: {
        schoolID: schoolID,
      },
      // Foreign table include
      include: {
        contact: true, // Include the associated ContactDetails
      },
    });

    if (school) {
      const isMatch = bcryptjs.compareSync(password, school.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            apiKey: school.apiKey,
            schoolID: schoolID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            SchoolDetails: school,
            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};

export const teacherLogin = async (req, res, next) => {
  const { teacherID, password } = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        teacherID: teacherID,
      },
    });

    if (teacher) {
      const isMatch = bcryptjs.compareSync(password, teacher.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            teacherID: teacherID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            TeacherDetails: teacher,
            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};

export const studentLogin = async (req, res, next) => {
  const { studentID, password } = req.body;
  try {
    const student = await prisma.student.findUnique({
      where: {
        studentID: studentID,
      },
    });

    if (student) {
      const isMatch = bcryptjs.compareSync(password, student.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            studentID: studentID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            StudentDetails: student,

            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};

// export const studentLogin = async (req, res, next) => {
//   const { studentID, password } = req.body;
//   try {
//     const student = await Teacher.findOne({ studentID });

//     if (student) {
//       const isMatch = bcryptjs.compareSync(password, student.password);
//       if (isMatch) {
//         const token = jwt.sign(
//           {
//             apiKey: school.apiKey,
//             email: email,
//           },
//           process.env.JWT_SECRET
//           // {
//           //   expiresIn: "30s",
//           // }
//         );
//         return res
//           .cookie("token", token, {
//             path: "/",
//             // expires: new Date(Date.now() + 10000 * 30),
//             httpOnly: true,
//             sameSite: "lax",
//           })
//           .status(200)
//           .json({
//             Message: "Successfully Login",
//             SchoolDetails: school,
//             token,
//           });
//       } else {
//         return next(errorHandler(401, "School does not exist"));
//       }
//     } else {
//       return next(errorHandler(401, "School does not exist"));
//     }
//   } catch (error) {
//     next(error);
//   }
// };
