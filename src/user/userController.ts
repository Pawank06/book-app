import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");

    return next(error);
  }

  //Db Call

  try {
    const user = await userModel.findOne({
      email,
    });

    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  //process

  // password hash

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    // response

    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }

  // token generation
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  let user;

  try {
    user = await userModel.findOne({ email });

    if (!user) {
      const error = createHttpError(404, "User don't exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while loggin user"));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(createHttpError(400, "Invalid Username or Password"));
  }

  // Create a new access token

  try {
    const token = sign(
      {
        sub: user._id,
      },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
      }
    );

    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

export { createUser, loginUser };
