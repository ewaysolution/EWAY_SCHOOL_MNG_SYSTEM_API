import express from "express";
import {
  signupSchool,
  getSchoolByApiKey,
  getAllSchools,
  inActiveSchoolById,
  getSchoolBySchoolID
} from "../controller/school.controller.js";
import { verifyToken } from "../util/verifyUser.js";


const schoolRouter = express.Router();
schoolRouter.post("/create", signupSchool);
schoolRouter.get("/view", verifyToken, getAllSchools);
schoolRouter.get("/view/:schoolID", verifyToken,getSchoolBySchoolID);
schoolRouter.get("/view/apikey/:apiKey", getSchoolByApiKey);
schoolRouter.put("/delete/:schID", verifyToken, inActiveSchoolById);

export default schoolRouter;
