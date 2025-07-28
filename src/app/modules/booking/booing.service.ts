import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.module";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.module";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommer.interface";

//transactionId-create----------
const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
//Duplicate DB collection // replica
//replica DB ---> create booking -> create payment -> error -> update booking -- Replica DB

//createBooking----------------------
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Plase upload your profile to book a tour."
      );
    }

    //Tour--
    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }
    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    //booking-create
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    //throw new Error("Some fake error!");

    //Payment-create
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS?.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );
 
    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title discription costFrom location")
      .populate("payment");

    //*SSLCommerz ---------------------------
    const userName = (updateBooking?.user as any).name;
    const userphoneNumber = (updateBooking?.user as any).phoneNumber;
    const userEmail = (updateBooking?.user as any).emial;
    const userAddress = (updateBooking?.user as any).address;

    const sslPayload: ISSLCommerz = {
      name: userName,
      email: userEmail,
      phoneNumber: userphoneNumber,
      address: userAddress,
      amount: amount,
      transactionId: transactionId,
    };
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    //*session commit ---------------------------
    await session.commitTransaction(); //rollback
    session.endSession();

    return {
      paymentUrl: sslPayment.redirectGatewayURL,
      booking: updateBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
/* Success / commplete /  */
//frontend -> user -> tour -> book(pending) -> payment(upaid) ->
// SSL-commerz page -> payment (complete) -> Backend update payment(paid) & booking(confirmed)
// -> redirect to fronend -> frontend

/* Fail / cancel */
//frontend -> user -> tour -> book( pending ) -> payment(upaid) ->
// SSL-commerz page -> payment ( fial/cancel ) -> Backend update payment( fail / cancel ) &
// booking(confirmed) -> redirect to fronend -> frontend

//getAllBooking-----------------------
const getAllBooking = async () => {};

//getSingleBooking-------------------------
const getSingleBooking = async () => {};

//getUserBooking------------------------------
const getUserBooking = async () => {};

//updateBookingStatus-------------------------
const updateBookingStatus = async () => {};

export const BookingService = {
  createBooking,
  getAllBooking,
  getUserBooking,
  getSingleBooking,
  updateBookingStatus,
};
