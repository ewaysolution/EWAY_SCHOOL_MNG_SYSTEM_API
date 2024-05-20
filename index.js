import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import schoolRouter from "./routes/school.router.js";
import teacherRouter from "./routes/teacher.route.js";
import subjectRouter from "./routes/subject.route.js";
import studentRouter from "./routes/student.route.js";
import authRouter from "./routes/auth.route.js";
import marksRouter from "./routes/marks.route.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Welcome to CleverSMS API" });
});

app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/school/auth", authRouter);
app.use("/api/v1/school/teacher", teacherRouter);
app.use("/api/v1/school/subject", subjectRouter);
app.use("/api/v1/school/student", studentRouter);
app.use("/api/v1/school/student/marks", marksRouter);







app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
