import express, { type Router } from "express";
import {
  forgotPasswordView,
  loginView,
  formView,
  loginAccount,
  resetPasswordAccount,
  registerAccount,
  forgotPasswordAccount,
  verifyAccountView,
  resetPasswordView,
} from "../controllers/userController.ts";

const router: Router = express.Router();

router.route("/login").get(loginView).post(loginAccount);

router.route("/register").get(formView).post(registerAccount);

router
  .route("/forgot-password")
  .get(forgotPasswordView)
  .post(forgotPasswordAccount);

router.route("/verify/:token").get(verifyAccountView);

router
  .route("/reset-password/:token")
  .get(resetPasswordView)
  .post(resetPasswordAccount);

export default router;
