import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booing.service";
import { JwtPayload } from "jsonwebtoken";

//create Booking------------
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload;
  console.log("user:", decodeToken);

  const booking = await BookingService.createBooking(
    req.body,
    decodeToken.userId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

//get All Booking----------------
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getAllBooking();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

//get Single Booking----------------
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getSingleBooking();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

//get User Booking----------------
const getUserBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getUserBooking();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

//get User Booking----------------
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.updateBookingStatus();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

export const BooingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  getUserBooking,
  updateBookingStatus,
};
