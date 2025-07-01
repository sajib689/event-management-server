import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";

export const CreateEventService = async (
  event: Partial<IEvent>
): Promise<IEvent | null> => {
  try {
    const newEvent = await Event.create(event);
    return newEvent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
    return null;
  }
};

export const joinEventService = async (
  eventId: string,
  userId: string
): Promise<IEvent | null> => {
  try {
    const isExitOnEvent = await Event.findById(eventId);
    if (isExitOnEvent?.joinedUsers.includes(userId)) {
      throw new Error("User has already joined this event");
    }
    const updateEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $inc: { attendeeCount: 1 },
        $push: { joinedUsers: userId },
      },
      { new: true }
    );
    return updateEvent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
    return null;
  }
};

export const getEventService = async (filters: {
  search?: string;
  dateFilter?:
    | "today"
    | "currentWeek"
    | "lastWeek"
    | "currentMonth"
    | "lastMonth"
    | "custom";
  startDate?: Date;
  endDate?: Date;
}): Promise<IEvent[] | null> => {
  try {
    let query: any = {};
    if (filters?.search) {
      query.title = { $regex: filters?.search, $options: "i" };
    }
    if (filters?.dateFilter) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;
      switch (filters.dateFilter) {
        case "today":
          (startDate = startOfToday()), (endDate = endOfToday());
          break;
        case "currentWeek":
          startDate = startOfWeek(now);
          endDate = endOfWeek(now);
          break;
        case "lastWeek":
          startDate = startOfWeek(subWeeks(now, 1));
          endDate = endOfWeek(subWeeks(now, 1));
          break;
        case "currentMonth":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "lastMonth":
          startDate = startOfMonth(subMonths(now, 1));
          endDate = endOfMonth(subMonths(now, 1));
          break;
        case "custom":
          if (filters.startDate && filters.endDate) {
            startDate = filters.startDate;
            endDate = filters.endDate;
          } else {
            throw new Error(
              "Custom date range requires both start and end dates"
            );
          }
          break;
        default:
          throw new Error("Invalid date filter");
      }
      query.date = { $gte: startDate, $lte: endDate };
    }
    const events = await Event.find(query);
    return events;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
    return null;
  }
};


export const deleteEventService = async (id: string): Promise<IEvent | null> => {
  try {
    const deleted = await Event.findByIdAndDelete(id);
    return deleted;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete event");
  }
};
export const updateEventService = async (
  id: string,
  payload: Partial<IEvent>
): Promise<IEvent | null> => {
  try {
    const updated = await Event.findByIdAndUpdate(id, payload, { new: true });
    return updated;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update event");
  }
};
export const getMyEventsService = async (postedBy: string): Promise<IEvent[]> => {
  try {
    const events = await Event.find({ postedBy: { $regex: postedBy, $options: "i" } });
    console.log("Matched Events:", events); // ✅ log this
    return events;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get your events");
  }
};

