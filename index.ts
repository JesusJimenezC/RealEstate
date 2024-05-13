import express, { type Express, type Request } from "express";
import userRoutes from "./src/routes/userRoutes.ts";
import db from "./src/config/db.ts";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import propertyRoutes from "./src/routes/propertyRoutes.ts";

// App init
const app: Express = express();
const PORT: number = 3000;

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "secret",
  cookieName: process.env.COOKIE_NAME || "csrf-cookie",
  cookieOptions: {
    path: "/",
    sameSite: "strict",
    secure: false,
    signed: true,
  },
  size: 32,
  getTokenFromRequest: (req) => {
    return req.body["csrfToken"] || req.headers["x-csrf-token"];
  },
});

// DB connection
try {
  await db.authenticate();
  await db.sync();
  console.log("Database Connected");
} catch (error) {
  console.log(error);
}

// Configure body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CSRF_SECRET || "secret_key"));
app.use(doubleCsrfProtection);

// Configurations
app.set("view engine", "pug");
app.set("views", "./src/views");

// Public folder
app.use(express.static("./src/public"));

// Routing
app.use("/auth", doubleCsrfProtection, userRoutes);
app.use("/", doubleCsrfProtection, propertyRoutes);

// Server
app.listen(process.env.PORT || 3000, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { doubleCsrfProtection };
