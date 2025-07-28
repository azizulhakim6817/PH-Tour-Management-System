import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommer.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  //*SSLCommerz ---------------------------
  const userName = (booking?.user as any).name;
  const userphoneNumber = (booking?.user as any).phoneNumber;
  const userEmail = (booking?.user as any).email;
  const userAddress = (booking?.user as any).address;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: userEmail,
    phoneNumber: userphoneNumber,
    address: userAddress,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };
  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.redirectGatewayURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  //update Booking status to confirm
  //update payment status to Paid
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    //Payment-create
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title discription costFrom location")
      .populate("payment");

    //*session commit ---------------------------
    await session.commitTransaction(); //rollback
    session.endSession();

    return {
      success: true,
      message: "Payment Complecte Successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  //update Booking status to confirm
  //update payment status to Paid
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );

    if (!updatePayment) {
      throw new Error("Payment not found with this transactionId.");
    }

    await Booking.findByIdAndUpdate(
      updatePayment.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment Failed!",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  //update Booking status to confirm
  //update payment status to Paid
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELED },
      { runValidators: true, session }
    );

    if (!updatePayment) {
      throw new Error("Payment not found with this transactionId.");
    }

    await Booking.findByIdAndUpdate(
      updatePayment.booking,
      { status: BOOKING_STATUS.CANCELED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment Canceled!",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
