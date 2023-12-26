import express from "express";
import { subjectRegister, getSubjectBySubjectID, getAllSubjects } from "../controller/subject.controller.js";

const subjectRouter = express.Router();

subjectRouter.post("/register", subjectRegister);
subjectRouter.get("/view/:subjectID", getSubjectBySubjectID);
subjectRouter.get("/view", getAllSubjects);
export default subjectRouter;
