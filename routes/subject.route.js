import express from "express";
import { subjectRegister, getAllSubjects } from "../controller/subject.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const subjectRouter = express.Router();

subjectRouter.post("/register",verifyToken,subjectRegister);
subjectRouter.get("/get",verifyToken, getAllSubjects);
// subjectRouter.get("/view/:subjectID", getSubjectBySubjectID);
// subjectRouter.get("/view", getAllSubjects);
export default subjectRouter;
