import { TErrorSources, TGenericError } from "../interfaces/error.types";

//zod Error------------------------------------------
export const handlerZodError = (err: any): TGenericError => {
  const errorSource: TErrorSources[] = [];
  console.log(err.issues);
  err.issues.forEach((issue: any) => {
    errorSource.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod Error!!",
    errorSource,
  };
};
