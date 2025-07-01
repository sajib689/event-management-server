import express from "express";
import {
  createEventController,
  getEventsController,
  joinEventController,
  getMyEventsController,
  updateEventController,
  deleteEventController,
} from "./event.controller";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

router.post("/events", asyncHandler(createEventController));
router.get("/events",asyncHandler(getEventsController) );
router.get("/my-events", asyncHandler(getMyEventsController));
router.post("/events/join/:eventId", asyncHandler(joinEventController));
router.put("/events/:id", asyncHandler(updateEventController));
router.delete("/events/:id", asyncHandler(deleteEventController));

export default router;
