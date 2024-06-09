import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorhandler from "./middlewares/globalErrorhandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";


const app = express();
app.use(express.json());

app.use(cors({
  origin: config.frontendDomain
}))

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome" });
});

app.use("/api/users/", userRouter);
app.use("/api/books/", bookRouter);

// Global error handler

app.use(globalErrorhandler);

export default app;
