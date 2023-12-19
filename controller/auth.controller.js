import bcryptjs from "bcryptjs";
import School from "../modal/school.modal.js";
import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";
export const schoolLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const school = await School.findOne({ email });

    if (school) {
      const isMatch = bcryptjs.compareSync(password, school.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            apiKey: school.apiKey,
            email: email,
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
        return next(errorHandler(401, "School does not exist"));
      }
    } else {
      return next(errorHandler(401, "School does not exist"));
    }
  } catch (error) {
    next(error);
  }
};
