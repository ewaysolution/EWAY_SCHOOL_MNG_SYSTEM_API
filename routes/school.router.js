import express from "express";
import { validateSchoolReg } from "../middleware/school.middleware.js";
import {
  signupSchool,
  getSchools,
  UpdateSchoolBySchoolID,
  getSchoolBySchoolID,
  getSchoolByApiKey,
  schoolPasswordResetRequest,
  changePasswordResetToken,
  changePassword,
} from "../controller/school.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const schoolRouter = express.Router();
schoolRouter.post("/create", validateSchoolReg, verifyToken, signupSchool);
schoolRouter.get("/", verifyToken, getSchools);
schoolRouter.put("/update/:schoolID", verifyToken, UpdateSchoolBySchoolID);
schoolRouter.get("/:schoolID", verifyToken, getSchoolBySchoolID);
schoolRouter.get("/apiKey/:apiKey", getSchoolByApiKey);
schoolRouter.post("/reset/resetpassword", schoolPasswordResetRequest);
schoolRouter.put("/reset/changePassword", changePasswordResetToken);
schoolRouter.put("/changePassword", changePassword);
export default schoolRouter;
