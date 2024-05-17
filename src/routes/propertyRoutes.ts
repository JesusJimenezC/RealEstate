import express, { type Router } from "express";
import {
  propertiesView,
  createPropertyView,
  createProperty,
  addImageView,
  saveImage,
  editPropertyView,
  editProperty,
  deleteProperty,
  showPropertyView,
} from "../controllers/propertyController.ts";
import { body } from "express-validator";
import secureRoute from "../middleware/secureRoute.ts";
import upload from "../middleware/uploadImage.ts";

const router: Router = express.Router();

router.route("/my-properties").get(secureRoute, propertiesView);

router
  .route("/properties/create")
  .get(secureRoute, createPropertyView)
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

router
  .route("/properties/add-image/:id")
  .get(secureRoute, addImageView)
  .post(secureRoute, upload.single("image"), saveImage);

router
  .route("/properties/edit/:id")
  .get(secureRoute, editPropertyView)
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
    editProperty,
  );

router.route("/properties/delete/:id").post(secureRoute, deleteProperty);

router.route("/property/:id").get(showPropertyView);

export default router;
