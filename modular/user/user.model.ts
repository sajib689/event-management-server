import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";

type userModel = Model<IUser, object>
export const userSchema = new Schema({

    name : {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    img: {
        type: String
    }
})

export const User = model<IUser, userModel>("User", userSchema)