import express, { type Router } from "express";
import {
  propertiesView,
  createView,
  createProperty,
  addImageView,
} from "../controllers/propertyController.ts";
import { body } from "express-validator";
import secureRoute from "../middleware/secureRoute.ts";

const router: Router = express.Router();

router.route("/my-properties").get(secureRoute, propertiesView);

router
  .route("/properties/create")
  .get(secureRoute, createView)
  .post(
    secureRoute,
    body("title").notEmpty().withMessage("Title is mandatory."),
    body("description")
      .notEmpty()
      .withMessage("Description is mandatory.")
      .isLength({ max: 70 })
      .withMessage("Description is too large."),
    body("category").isNumeric().withMessage("Category is mandatory."),
    body("price").isNumeric().withMessage("Price is mandatory."),
    body("rooms").isNumeric().withMessage("Room is mandatory."),
    body("parking").isNumeric().withMessage("Parking lot is mandatory."),
    body("wc").isNumeric().withMessage("WC is mandatory."),
    body("lat").notEmpty().withMessage("Select an address on the map."),
    createProperty,
  );

router.route("/properties/add-image/:id").get(secureRoute, addImageView);

export default router;
