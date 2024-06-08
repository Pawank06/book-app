import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cludinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs"

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const {title, genre} = req.body

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const filename = files.coverImage[0].filename;

  const filePath = path.join(__dirname, '../../public/data/uploads', filename)

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: filename,
    folder: "book-covers",
    format: coverImageMimeType
  });

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  )

  let bookFileUploadResult;
  try {
    bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
    resource_type: 'raw',
    filename_override: bookFileName,
    folder: 'book-pdfs',
    format: 'pdf'
  })

  console.log("book file upload result", bookFileUploadResult)
  } catch (error) {
    console.log(error)
    return next(createHttpError(500, 'Error while uploading the files'))

  }

  

  console.log("upload result", uploadResult)

  const newBook = await bookModel.create({
    title,
    genre,
    author: "66641df78c502d46ef0ab25e",
    coverImage: uploadResult.secure_url,
    file: bookFileUploadResult.secure_url,
  })

  //Delete tremp books

  await fs.promises.unlink(filePath)
  await fs.promises.unlink(bookFilePath)

  res.status(201).json({ id: newBook._id });
};

export { createBook };
