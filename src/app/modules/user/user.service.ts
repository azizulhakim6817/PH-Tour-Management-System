import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.module";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

//!create user -------------------------------------------------
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  /* if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist!");
  } */

  const hashPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email! as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  console.log(password);
  return user;
};

//! update user_di------------------------
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  //check user id--------------
  const ifUserExist = await User.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  //payload check----------------
  if (payload.role) {
    if (decodedToken.role == Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are nt authorized!");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    //password---
    if (payload.password) {
      payload.password = await bcryptjs.hash(
        payload.password,
        envVars.BCRYPT_SALT_ROUND
      );
    }
  }
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

//! get users all ------------------------------
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = { createUser, updateUser, getAllUsers };
