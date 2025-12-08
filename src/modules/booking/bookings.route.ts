import express from "express";
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("customer", "admin"), bookingController.createBooking);


router.get("/", auth("customer", "admin"), bookingController.getBookings);

router.put("/:bookingId", auth("customer", "admin"), bookingController.updateBooking);

export const bookingRoute = router;