import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const secureRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Verify is user is authenticated
  const { _token } = req.cookies;

  if (!_token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded: { id: number; name: string } = jwt.verify(
      _token,
      process.env.JWT_SECRET_KEY || "secret_key",
    ) as { id: number; name: string };
    const user = await User.scope("removePassword").findByPk(decoded.id);
    console.log({ user });

    // Save user in request
    if (!user) {
      return res.redirect("/auth/login");
    }

    req.user = user;

    return next();
  } catch {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default secureRoute;
