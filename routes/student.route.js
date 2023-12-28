import express from "express";
import { registerStudent, getStudentDetailsBySchoolIDStudentID, getAllStudentDetails } from "../controller/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.get("/get/:schoolID/:studentID", getStudentDetailsBySchoolIDStudentID);
studentRouter.get("/show/school/:schoolID", getAllStudentDetails);
export default studentRouter;
