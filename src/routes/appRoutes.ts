import express, { type Router } from "express";
import {
  categories,
  home,
  notFound,
  search,
} from "../controllers/appController.ts";

const router: Router = express.Router();

// Main page
router.route("/").get(home);

// Categories
router.route("/categories/:id").get(categories);

// 404 page
router.route("/404").get(notFound);

// Search page
router.route("/search").get(search);

export default router;
