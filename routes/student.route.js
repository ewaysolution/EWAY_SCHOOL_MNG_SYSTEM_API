import express from "express";
import { registerStudent } from "../controller/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
export default studentRouter;
