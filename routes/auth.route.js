import express from "express";
import {
  schoolLogin,
  teacherLogin,
  studentLogin,
  verifyEmail,
} from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", schoolLogin);
authRouter.post("/teacher/login", teacherLogin);
authRouter.post("/student/login", studentLogin);
authRouter.post("/user/verify", verifyEmail);

export default authRouter;
