import express from "express";
import { registerTeacher, getAllTeacherDetails, deleteTeacher, getTeacherWithSchoolDetails } from "../controller/teacher.controller.js";

const teacherRouter = express.Router();

teacherRouter.post("/register", registerTeacher);
teacherRouter.get("/get/:schoolID", getAllTeacherDetails);
teacherRouter.get("/get/teacher/:teacherID",getTeacherWithSchoolDetails);
teacherRouter.delete("/delete/:schoolID/:teacherID",deleteTeacher );
export default teacherRouter;
