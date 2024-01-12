import express from "express";
import {
  getMarks,
  addMarks,
  updateMarks,
  deleteMarks,
  inActiveMarks,
  getMarkBySchIDStdIDTermGrade,
  getAllSchoolMarks,
  getMarkBySchoolID,
} from "../controller/marks.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const marksRouter = express.Router();
marksRouter.get("/view/:schoolID", verifyToken, getMarkBySchoolID);
marksRouter.get("/view/:schoolID/:studentID", verifyToken, getMarks);
marksRouter.get(
  "/view/:schoolID/:studentID/:grade/:term",
  getMarkBySchIDStdIDTermGrade
);
marksRouter.post("/create", verifyToken, addMarks);
marksRouter.delete(
  "/delete/:id",
  deleteMarks
);
marksRouter.get("/getall", getAllSchoolMarks);

export default marksRouter;
