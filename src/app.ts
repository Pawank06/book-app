import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorhandler from "./middlewares/globalErrorhandler";

const app = express();

app.get("/", (req, res, next) => {
  
  res.json({ message: "Welcome" });
});

// Global error handler

app.use(globalErrorhandler);

export default app;
