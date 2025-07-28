import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


//! create user -------------------------------
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

//! Update user -------------------------------
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    /* const token = req.headers.authorization;
    const verifiedToken = verifyToken(
      token as string,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;
 */

    //index.d.ts user error is not show -------
    const verifiedToken = req.user;
    console.log("verifi: ", verifiedToken);

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Update successfully",
      data: user,
    });
  }
);
//! getAll users -------------
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All user retrieved successfully",
      data: result,
      meta: result.meta,
    });
  }
);

export const UserController = { createUser, updateUser, getAllUser };
