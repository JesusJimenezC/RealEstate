import express, { type Router } from "express";
import {
  formForgotPassword,
  formLogin,
  formRegister,
  login,
  newPassword,
  register,
  resetPassword,
  verifyAccount,
  verifyToken,
} from "../controllers/userController.ts";

const router: Router = express.Router();

router.route("/login").get(formLogin).post(login);

router.route("/register").get(formRegister).post(register);

router.route("/forgot-password").get(formForgotPassword).post(resetPassword);

router.route("/verify/:token").get(verifyAccount);

router.route("/reset-password/:token").get(verifyToken).post(newPassword);

export default router;
