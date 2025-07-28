import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokent } from "../../utils/userToken";
import { envVars } from "../../../config/env";
import passport from "passport";

//! Login-------------------
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //const loginInfo = await AuthService.credentialsLogin(req.body);

    //passport -----------------------
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        //not => throw new AppError(303, "lkas")
        //not => next(err)
        //right => return next(err);
        //return new AppError(401, err);
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }
      const userToken = await createUserTokent(user);

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userToken);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
          accssToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: user,
        },
      });
    })(req, res, next);
  }
);
//! Get token----------------
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token retrived successfully",
      data: tokenInfo,
    });
  }
);

//!Logout ----------------
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged Out successfully",
      data: null,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token retrived successfully",
      data: null,
    });
  }
);

//! Reset Password ----------------
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.password;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthService.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Change successfully",
      data: null,
    });
  }
);
//! google url and callbacke url ----------------
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    //booking => booking => "/"  => "/"

    const user = req.user;
    console.log(user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
    }

    const tokenInto = createUserTokent(user);
    setAuthCookie(res, tokenInto);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
