import express from "express";
import { gradeRegister, getAllGrade,regStudentPromotion,getStudentPromotion } from "../controller/grade.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const gradeRouter = express.Router();

gradeRouter.post("/register",verifyToken,gradeRegister);
gradeRouter.get("/get",verifyToken, getAllGrade);


gradeRouter.post("/student/promotion/register",verifyToken, regStudentPromotion);
gradeRouter.get("/student/promotion/get", getStudentPromotion);


export default gradeRouter;















