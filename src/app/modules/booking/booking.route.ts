import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation";
import { BooingController } from "./booking.controller";

const router = express.Router();

//create booking-----------------------
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BooingController.createBooking
);

//get All booking--------------------
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BooingController.getAllBooking
);

//get User booking---------------
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BooingController.getUserBooking
);

//get Single bookingId-------------------------------
router.get(
  "/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BooingController.getSingleBooking
);

//update-status booking-------------------------------
router.patch(
  "/:booking/:status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingStatusZodSchema),
  BooingController.updateBookingStatus
);

export const BookingRoutes = router;
