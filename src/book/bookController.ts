import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cludinary";
import path from "path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

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

  try {
    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
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

  res.json({ message: "Welcome" });
};

export { createBook };
