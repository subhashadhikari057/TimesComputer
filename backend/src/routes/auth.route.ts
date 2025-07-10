import express from "express";
const router = express.Router();

import { register, login, refresh, logout, changePassword } from "../controllers/auth.controller";
import { authenticate, isSuperadmin } from "../middlewares/auth.middleware";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/change-password").patch(authenticate, isSuperadmin, changePassword);

export default router;