import express from "express";
import {registerMarks,getAllMarks,updateMarks,deleteMarks,getMarksByStudentIDGradeTerm, getMarksByGradeTerm} from "../controller/marks.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const marksRouter = express.Router();
marksRouter.post("/register", verifyToken, registerMarks);
marksRouter.get("/get/:schoolID", verifyToken, getAllMarks);
marksRouter.get("/get/:schoolID/:studentID/:grade/:term", verifyToken, getMarksByStudentIDGradeTerm);
marksRouter.get("/get/:schoolID/:grade/:term", verifyToken, getMarksByGradeTerm);

marksRouter.put("/update/:schoolID/:studentID/:id", verifyToken, updateMarks);
marksRouter.delete("/delete/:schoolID/:studentID/:id", verifyToken, deleteMarks);

 
export default marksRouter;
