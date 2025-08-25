import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

import { PaymentRoute } from "../modules/payment/payment.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/payment",
    route: PaymentRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
