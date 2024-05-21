import express from "express";
import { registerStudent,getStudentByID,getAllStudentBySchoolID,updateStudentByStudentIDSchoolID} from "../controller/student.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const studentRouter = express.Router();

studentRouter.post("/register",verifyToken, registerStudent);
studentRouter.get("/get/:schoolID/:studentID", verifyToken,getStudentByID);
studentRouter.get("/get/:schoolID/", verifyToken,getAllStudentBySchoolID);
studentRouter.put("/:schoolID/:studentID", verifyToken,updateStudentByStudentIDSchoolID);
// studentRouter.get("/show/school/:schoolID", getAllStudentDetails);
// studentRouter.delete("/delete/:schoolID/:studentID",deleteStudent );
export default studentRouter;
