import express from "express";
import {  schoolLogin,teacherLogin,studentLogin } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', schoolLogin );
authRouter.post('/teacher/login', teacherLogin );
authRouter.post('/student/login', studentLogin );
 
export default authRouter