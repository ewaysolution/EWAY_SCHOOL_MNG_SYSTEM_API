import express from "express";
import { validateSchoolReg} from "../middleware/school.middleware.js";
import {
  signupSchool,getSchools,UpdateSchoolBySchoolID,getSchoolBySchoolID,getSchoolByApiKey,
  schoolPasswordResetRequest,schoolPasswordChange
} from "../controller/school.controller.js";
import { verifyToken } from "../util/verifyUser.js";


const schoolRouter = express.Router();
schoolRouter.post("/create", validateSchoolReg,verifyToken,signupSchool);
schoolRouter.get("/",verifyToken,getSchools);
schoolRouter.put("/update/:schoolID",verifyToken,UpdateSchoolBySchoolID);
schoolRouter.get("/:schoolID",verifyToken,getSchoolBySchoolID);
schoolRouter.get("/apiKey/:apiKey",getSchoolByApiKey);
schoolRouter.post("/resetpassword",schoolPasswordResetRequest);
schoolRouter.put("/changePassword",schoolPasswordChange);
export default schoolRouter;
