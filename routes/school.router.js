import express from "express";
import { validateSchoolReg} from "../middleware/school.middleware.js";
import {
  signupSchool,getSchools,UpdateSchoolBySchoolID
} from "../controller/school.controller.js";
import { verifyToken } from "../util/verifyUser.js";


const schoolRouter = express.Router();
schoolRouter.post("/create", validateSchoolReg,verifyToken,signupSchool);
schoolRouter.get("/",verifyToken,getSchools);
schoolRouter.put("/update/:schoolID",verifyToken,UpdateSchoolBySchoolID);

// schoolRouter.get("/view", verifyToken, getAllSchools);
// schoolRouter.get("/view/:schoolID", verifyToken,getSchoolBySchoolID);
// schoolRouter.get("/view/apikey/:apiKey", getSchoolByApiKey);
// schoolRouter.put("/delete/:schID", verifyToken, inActiveSchoolById);

export default schoolRouter;
