import express, { type Router } from "express";
import { properties } from "../controllers/apiController.ts";

const router: Router = express.Router();

router.route("/properties").get(properties);

export default router;
