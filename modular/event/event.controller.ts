import { Request, Response } from "express";
import { CreateEventService, getEventService, joinEventService } from "./event.service";
import { IEvent } from "./event.interface";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      _id: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

// POST /api/events
export const createEventController = async (req: Request, res: Response) => {
  try {
    const eventData: Partial<IEvent> = req.body;

    const createdEvent = await CreateEventService(eventData);

    if (!createdEvent) {
      return res.status(400).json({
        success: false,
        message: "Failed to create event",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: createdEvent,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};



export const getEventsController = async (req: Request, res: Response) => {
  try {
    const {
      search,
      dateFilter,
      startDate,
      endDate,
    } = req.query as {
      search?: string;
      dateFilter?:
        | "today"
        | "currentWeek"
        | "lastWeek"
        | "currentMonth"
        | "lastMonth"
        | "custom";
      startDate?: string;
      endDate?: string;
    };

    // Parse dates from query strings if provided
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate) parsedStartDate = new Date(startDate);
    if (endDate) parsedEndDate = new Date(endDate);

    const events = await getEventService({
      search,
      dateFilter,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });

    if (!events) {
      return res.status(404).json({ message: "No events found." });
    }

    return res.status(200).json(events);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const joinEventController = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?._id; // Assuming userId is in req.user after authentication middleware

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const updatedEvent = await joinEventService(eventId, userId);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found or could not join" });
    }

    return res.status(200).json({
      message: "Joined event successfully",
      event: updatedEvent,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to join event" });
  }
};


// DELETE /api/events/:id
export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteEventService(id);
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Delete failed" });
  }
};
// PUT /api/events/:id
export const updateEventController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updated = await updateEventService(id, payload);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Update failed" });
  }
};
import {
  getMyEventsService,
  updateEventService,
  deleteEventService,
} from "./event.service";

// GET /api/my-events?name=yourName
export const getMyEventsController = async (req: Request, res: Response) => {
  try {
    const { postedBy } = req.query;
    console.log(postedBy)
    if (!postedBy || typeof postedBy !== "string") {
      return res.status(400).json({ message: "Name is required as query" });
    }

    const events = await getMyEventsService(postedBy);
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
