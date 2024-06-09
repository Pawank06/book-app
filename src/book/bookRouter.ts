import express from "express";
import { createBook, updateBook, listBook, listSingleBook, deleteSingleBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 },
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch("/:bookId", authenticate,
upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
]),
updateBook
)

bookRouter.get("/", listBook)
bookRouter.get("/:bookId", authenticate, listSingleBook)
bookRouter.delete("/:bookId", authenticate, deleteSingleBook)

export default bookRouter;
