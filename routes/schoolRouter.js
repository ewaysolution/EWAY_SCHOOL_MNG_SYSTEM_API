import express from "express";
import { createSchool, getSchoolByApiKey, getSchools } from "../controller/school.controller.js";

const schoolRouter = express.Router();

schoolRouter.post('/create', createSchool )
schoolRouter.get('/view', getSchools )
schoolRouter.get('/view/apikey/:apiKey', getSchoolByApiKey )
export default schoolRouter