import express from "express";
import {  schoolLogin } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', schoolLogin );
export default authRouter