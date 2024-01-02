import express from "express";
import { registerStudent, getStudentDetailsBySchoolIDStudentID, getAllStudentDetails, deleteStudent } from "../controller/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.get("/get/:schoolID/:studentID", getStudentDetailsBySchoolIDStudentID);
studentRouter.get("/show/school/:schoolID", getAllStudentDetails);
studentRouter.delete("/delete/:schoolID/:studentID",deleteStudent );
export default studentRouter;
