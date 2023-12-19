import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import schoolRouter from "./routes/school.router.js";
import authRouter from "./routes/auth.route.js";
import marksRouter from "./routes/marks.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

  
 
app.use("/api/school/auth", authRouter);
app.use("/api/school/marks", marksRouter);

app.use("/api/school", schoolRouter);
app.use("/api/school/auth", authRouter);
app.use("/api/school/marks", marksRouter);

app.use((err, re, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Server Running
var listener = app.listen(process.env.PORT, () => {
  console.log(`🚀 App listening on the port ${listener.address().port}`);
});

