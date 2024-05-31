import express from "express";
import { gradeRegister, getAllGrade,regStudentPromotion,getStudentPromotion } from "../controller/grade.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const gradeRouter = express.Router();

gradeRouter.post("/register",verifyToken,gradeRegister);
gradeRouter.get("/get",verifyToken, getAllGrade);


gradeRouter.post("/student/promotion/register",verifyToken, regStudentPromotion);
gradeRouter.get("/student/promotion/get",verifyToken, getStudentPromotion);
// subjectRouter.get("/view/:subjectID", getSubjectBySubjectID);
// subjectRouter.get("/view", getAllSubjects);
export default gradeRouter;
