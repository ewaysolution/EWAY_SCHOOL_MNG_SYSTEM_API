import express from "express";
import { registerStudent, getStudentDetailsByIndex, getAllStudentDetails } from "../controller/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.get("/show/:studentID", getStudentDetailsByIndex);
studentRouter.get("/show/school/:schoolID", getAllStudentDetails);
export default studentRouter;
