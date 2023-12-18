import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // token = token Name
// console.log(token)
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }
      req.user = user;
      // console.log(user.apiKey);
      // console.log(user.schoolID);
      next();
    });
  } catch (error) {
    return next(error);
  }
};
