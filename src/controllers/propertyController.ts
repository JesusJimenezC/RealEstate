import type { Request, Response } from "express";
import { Category, Price, Property } from "../models";
import {
  type Result,
  type ValidationError,
  validationResult,
} from "express-validator";

const propertiesView = (_req: Request, res: Response): void => {
  res.render("properties/admin", {
    page: "My Properties",
  });
};

const createPropertyView = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const [categories, prices]: [Category[], Price[]] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Create Property",
    csrfToken: req.csrfToken?.(),
    categories,
    prices,
    data: {},
  });
};

const createProperty = async (req: Request, res: Response): Promise<void> => {
  const [categories, prices]: [Category[], Price[]] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  // Validation
  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("properties/create", {
      page: "Create Property",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  // Create property
  const {
    price: priceId,
    category: categoryId,
    title,
    description,
    rooms,
    parking,
    wc,
    street,
    lat,
    lng,
  } = req.body;

  const { id: userId } = req.user ?? { id: undefined };

  try {
    const propertySaved: Property = await Property.create({
      title,
      description,
      rooms,
      parking,
      wc,
      street,
      lat,
      lng,
      image: "",
      priceIdFK: priceId,
      categoryIdFK: categoryId,
      userIdFK: userId,
    });

    const { id }: Property = propertySaved;
    res.redirect(`/properties/add-image/${id}`);
  } catch (error) {
    console.log(error);
    res.render("properties/create", {
      page: "Create Property",
      csrfToken: req.csrfToken?.(),
      categories,
      prices,
      errors: [{ msg: "Error creating property." }],
      data: req.body,
    });
  }
};

const addImageView = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || property.published || property.userIdFK !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  res.render("properties/add-image", {
    page: `Add image to: ${property.title}`,
    csrfToken: req.csrfToken?.(),
    property,
  });
};

export { propertiesView, createPropertyView, createProperty, addImageView };
