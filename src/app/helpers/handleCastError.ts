import mongoose from "mongoose";
import { TGenericError } from "../interfaces/error.types";

//Cast Error -----------------
export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericError => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID, Please a valid id  !",
  };
};
