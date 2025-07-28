import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
} from "./tour.validation";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

/*-----------------------------Tour Type Routes---------------------------- */
//create tour-types
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.createTourType
);
//Get tour type
router.get("/tour-types", TourController.getAllTourType);

//Update tour-type
router.patch(
  "/tour-types-update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.updateTourType
);

//Delete tour-type
router.delete(
  "/tour-types-delete/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);

/*-----------------------------Tour Route--------------------------------------- */
router.post(
  "/create-tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.createTour
);

router.get("/", TourController.getAllTour);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

export const TourRoutes = router;
