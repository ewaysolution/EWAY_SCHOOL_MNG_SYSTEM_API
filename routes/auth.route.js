import express from "express";
import {  schoolLogin, teacherLogin } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', schoolLogin );
authRouter.post('/teacher/login', teacherLogin );
export default authRouter