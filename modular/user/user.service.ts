import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { generateAccessToken, generateRefreshToken } from "../../middleware/auth.middleware";


export const registerService = async (user: Partial<IUser>): Promise<IUser | null> => {
    try {
        if(!user?.password) {
            throw new Error("Password is required")
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(user?.password, salt)

        const newUser = {
            ...user,
            password: hashPassword
        }

        const createUser = await User.create(newUser)
        return createUser

    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error?.message)
        }
        return null;
    }
}

interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export const loginService = async (email: string, password: string): Promise<ILoginResponse | null> => {
    try {
        const user = await User.findOne({email})
        if (!user) throw new Error("User not found");
        const isMatch  = bcrypt.compareSync(password, user?.password)
        if (!isMatch) throw new Error("Invalid credentials");
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        return {
            user,
            accessToken,
            refreshToken
        };

    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error?.message)
        }
        return null
    }
}