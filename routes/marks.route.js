import express from "express";
import {
    getMarks,
    addMarks,
    updateMarks,
    deleteMarks,
    inActiveMarks,
    getMarkBySchIDStdIDTermGrade,
    getAllSchoolMarks,
    getMarkBySchoolID
} from "../controller/marks.controller.js";
import { verifyToken } from "../util/verifyUser.js";


const marksRouter = express.Router();
marksRouter.get("/view/:schoolID", verifyToken, getMarkBySchoolID);
marksRouter.get("/view/:schoolID/:studentID", verifyToken, getMarks);
marksRouter.get("/view/:schoolID/:studentID/:grade/:term", getMarkBySchIDStdIDTermGrade);
marksRouter.post("/create", verifyToken, addMarks);
marksRouter.put("/update/:id", verifyToken, updateMarks);
marksRouter.delete("/delete/:id", verifyToken, deleteMarks);
marksRouter.put("/delete/:id", verifyToken, inActiveMarks);
marksRouter.get("/getall", getAllSchoolMarks);

export default marksRouter;