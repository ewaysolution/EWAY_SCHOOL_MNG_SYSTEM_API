import express from "express";
import { registerTeacher,subjectTaken,getTeacher,getAllTeacherBySchoolID,updateTeacherByTeacherSchoolID } from "../controller/teacher.controller.js"
import { verifyToken } from "../util/verifyUser.js";
const teacherRouter = express.Router();

teacherRouter.post("/register", verifyToken, registerTeacher);
teacherRouter.get("/:teacherID", verifyToken,getTeacher);
teacherRouter.post("/subjectTaken", verifyToken,subjectTaken);
teacherRouter.get("/get/:schoolID", verifyToken,getAllTeacherBySchoolID);
teacherRouter.put("/:schoolID/:teacherID", verifyToken,updateTeacherByTeacherSchoolID);

// teacherRouter.get("/get/:schoolID", getAllTeacherDetails);
// teacherRouter.get("/get/teacher/:teacherID",getTeacherWithSchoolDetails);
// teacherRouter.delete("/delete/:schoolID/:teacherID",deleteTeacher );
export default teacherRouter;
