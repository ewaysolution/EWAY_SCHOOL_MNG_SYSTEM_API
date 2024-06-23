import express from "express";
import { subjectRegister, getAllSubjects } from "../controller/subject.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const subjectRouter = express.Router();

subjectRouter.post("/register",verifyToken,subjectRegister);
subjectRouter.get("/get",verifyToken, getAllSubjects);

export default subjectRouter;
