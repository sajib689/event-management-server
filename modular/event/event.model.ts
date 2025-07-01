import { Model, Schema, model } from "mongoose";
import { IEvent } from "./event.interface";

type eventModel = Model<IEvent, object>
export const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attendeeCount: {
      type: Number,
      default: 0,
    },
    joinedUsers: {
        type: [String],
        default: [],
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);


export const Event = model<IEvent, eventModel>("Event", eventSchema)