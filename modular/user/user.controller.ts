import { Request, Response } from "express";
import { loginService, registerService } from "./user.service";
import { User } from "./user.model";

export const registerController = async (req: Request, res: Response) => {
  try {
    const userData = req?.body;
    const { email } = userData;

    const isExiting = await User.findOne({ email });
    if (isExiting) {
      res.status(400).json({
        message: "User already exists",
        status: "error",
      });
    }

    const user = await registerService(userData);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const email = req?.body?.email;
    const password = req?.body?.password;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "error",
      });
    }
    const user = await loginService(email, password);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }
    res.status(200).json({
      success: 200,
      message: "Login Success",
      user: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
  }
};
