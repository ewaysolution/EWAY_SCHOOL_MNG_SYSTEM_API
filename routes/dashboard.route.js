import express from "express";
import { getDashboardElements} from "../controller/dashboard.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const dashboardRouter = express.Router();

dashboardRouter.get("/elements/:schoolID",verifyToken,getDashboardElements);

export default dashboardRouter;
