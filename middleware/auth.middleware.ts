import jwt from "jsonwebtoken";
import { IUser } from './../modular/user/user.interface';
const accessToken = process.env.ACCESS_TOKEN || '2111'
const refreshToken = process.env.REFRESH_TOKEN || '3222'

if (!accessToken || !refreshToken) {
  throw new Error("JWT secrets are not defined in environment variables");
}
export const generateAccessToken = (user: Partial<IUser>) => {
    return jwt.sign(
        {
            email: user?.email,
        },
        accessToken,
        {expiresIn: "7d" }
    )
}

export const generateRefreshToken = (user: Partial<IUser>) => {
    return jwt.sign(
        {
            email: user?.email
        },
        refreshToken,
        {expiresIn: "7d"}
    )
}