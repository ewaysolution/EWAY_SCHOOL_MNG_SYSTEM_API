import express from "express";
import { registerTeacher } from "../controller/teacher.controller.js";

const teacherRouter = express.Router();

teacherRouter.post("/register", registerTeacher);
export default teacherRouter;
