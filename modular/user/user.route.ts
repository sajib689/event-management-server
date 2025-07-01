import express from 'express';
import { loginController, registerController } from './user.controller';
import { asyncHandler } from './../../middleware/asyncHandler';

const userRouter = express.Router();

userRouter.post('/register', asyncHandler(registerController));
userRouter.post('/login', asyncHandler(loginController));

export default userRouter;
