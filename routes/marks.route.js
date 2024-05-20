import express from "express";
import {registerMarks} from "../controller/marks.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const marksRouter = express.Router();
marksRouter.post("/registers", verifyToken, registerMarks);


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
