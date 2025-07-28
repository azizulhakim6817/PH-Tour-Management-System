import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.contorller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

//! create user-----------------------------------------------------
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
//! get all user Super Admin----------------------------------------------------
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUser
);
//! Update user----------------------------------------------------
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export const UserRoutes = router;
