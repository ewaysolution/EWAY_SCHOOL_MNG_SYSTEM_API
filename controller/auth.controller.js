import bcryptjs from "bcryptjs";
import School from "../modal/school.modal.js";
import Teacher from "../modal/teacher.modal.js";
import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";
export const schoolLogin = async (req, res, next) => {
  const { schoolID, password } = req.body;
  try {
    const school = await School.findOne({ schoolID });

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
        return next(errorHandler(401, "School information not found."));
      }
    } else {
      return next(errorHandler(401, "School information not found."));
    }
  } catch (error) {
    next(error);
  }
};

// Teachers login page
export const teacherLogin = async (req, res, next) => {
  const { teacherID, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ teacherID });

    if (teacher) {
      const isMatch = bcryptjs.compareSync(password, teacher.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            apiKey: teacher.apiKey,
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
        return next(errorHandler(401, "Teacher does not exist"));
      }
    } else {
      return next(errorHandler(401, "Teacher does not exist"));
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
