import { TGenericError } from "../interfaces/error.types";

//Duplicate handlerDuplicateError------
export const handlerDuplicateError = (err: any): TGenericError => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exists!!`,
  };
};
