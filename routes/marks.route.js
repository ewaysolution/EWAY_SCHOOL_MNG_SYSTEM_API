import express from "express";
import {registerMarks,getAllMarks} from "../controller/marks.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const marksRouter = express.Router();
marksRouter.post("/register", verifyToken, registerMarks);
marksRouter.get("/get/:schoolID", verifyToken, getAllMarks);


// marksRouter.get("/view/:schoolID", verifyToken, getMarkBySchoolID);
// marksRouter.get("/view/:schoolID/:studentID", verifyToken, getMarks);
// marksRouter.get(
//   "/view/:schoolID/:studentID/:grade/:term",
//   getMarkBySchIDStdIDTermGrade
// );

// marksRouter.delete(
//   "/delete/:id",
//   deleteMarks
// );
// marksRouter.get("/getall", getAllSchoolMarks);

export default marksRouter;
