import { NextFunction, Request, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);
//google url and callbacke url
//bowser url -->
// /booking -> /login -> successfull google login -> booking frontend
// /login -> successfull google login -> /fronend

//http://localhost:8000/api/v1/auth/google?redirect=/booking-->frontend url--> http://localhost:5173/
//http://localhost:8000/api/v1/auth/google ---> frontend url ---> http://localhost:5173/
router.get("/google", async (req, res, next) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});

// /api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "./login" }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
