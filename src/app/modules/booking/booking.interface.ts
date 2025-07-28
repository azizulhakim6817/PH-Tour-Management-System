import { Types } from "mongoose";

// Enum for booking status
export enum BOOKING_STATUS {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment: Types.ObjectId;
  guestCount?: number;
  status: BOOKING_STATUS;
}
