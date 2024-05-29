import jwt from "jsonwebtoken";
import User from "../models/User";
import type { NextFunction, Request, Response } from "express";

export const identifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _token } = req.cookies;

    if (!_token) {
      req.user = undefined;
      return next();
    }

    const decoded: { id: number; name: string } = jwt.verify(
      _token,
      process.env.JWT_SECRET_KEY || "secret_key",
    ) as { id: number; name: string };
    const user = await User.findByPk(decoded.id);

    if (user) {
      req.user = user;
    }

    return next();
  } catch (e) {
    res.clearCookie("_token").redirect("/auth/login");
    res.status(401).send({ error: "Please authenticate." });
    return;
  }
};
