import mongoose from "mongoose";
import { TErrorSources, TGenericError } from "../interfaces/error.types";

//Mongoose ValidationError-----------------------------------
export const handlevalidationError = (
  err: mongoose.Error.ValidationError
): TGenericError => {
  const errorSource: TErrorSources[] = [];
  const errors = Object.values(err.errors);
  errors.forEach((errorObject: any) => {
    errorSource.push({
      path: errorObject?.path,
      message: errorObject?.message,
    });
  });
  return {
    statusCode: 400,
    message: "Validation Error!!",
    errorSource,
  };
};
