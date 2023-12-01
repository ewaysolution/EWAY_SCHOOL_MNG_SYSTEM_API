import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import schoolRouter from './routes/schoolRouter.js';
 


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

app.use("/api/school",schoolRouter)
 

app.use((err,re,res,next)=>{
  const statusCode = err.statusCode || 500;
  const message =  err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
});

// Server Running
var listener = app.listen(9000, () => {
  console.log(`Sever is run port ${listener.address().port}`);
});
