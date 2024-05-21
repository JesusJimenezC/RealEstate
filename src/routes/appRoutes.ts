import express, { type Router } from "express";
import {
  categoriesView,
  homeView,
  notFoundView,
  search,
} from "../controllers/appController.ts";

const router: Router = express.Router();

// Main page
router.route("/").get(homeView);

// Categories
router.route("/categories/:id").get(categoriesView);

// 404 page
router.route("/404").get(notFoundView);

// Search page
router.route("/search").post(search);

export default router;
