import type { NextFunction, Request, Response } from "express";
import { Category, Price, Property } from "../models";
import {
  type Result,
  type ValidationError,
  validationResult,
} from "express-validator";
import { unlink } from "node:fs/promises";

const propertiesView = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.user ?? { id: undefined };

  const properties = await Property.findAll({
    where: {
      userIdFK: id,
    },
    include: [
      {
        model: Price,
        as: "price",
        attributes: ["name"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["name"],
      },
    ],
  });

  res.render("properties/admin", {
    page: "My Properties",
    properties,
    csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
    property,
  });
};

const saveImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || property.published || property.userIdFK !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  try {
    property.image = req?.file ? req.file.filename : "";
    property.published = true;

    await property.save();

    return next();
  } catch (error) {
    console.log(error);
  }
};

const editPropertyView = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || property.userIdFK !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  const [categories, prices]: [Category[], Price[]] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    page: `Edit: ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
    categories,
    prices,
  });
};

const editProperty = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || property.userIdFK !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  const [categories, prices]: [Category[], Price[]] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  // Validation
  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("properties/edit", {
      page: `Edit: ${property.title}`,
      csrfToken: req.csrfToken(),
      property: req.body,
      categories,
      prices,
      errors: result.array(),
    });
  }

  // Update property
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

  try {
    property.set({
      title,
      description,
      rooms,
      parking,
      wc,
      street,
      lat,
      lng,
      priceIdFK: priceId,
      categoryIdFK: categoryId,
    });

    await property.save();

    res.redirect("/my-properties");
  } catch (error) {
    console.log(error);
    res.render("properties/edit", {
      page: `Edit: ${property.title}`,
      csrfToken: req.csrfToken(),
      property: req.body,
      categories,
      prices,
      errors: [{ msg: "Error updating property." }],
    });
  }
};

const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || property.userIdFK !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  if (property.image) {
    await unlink(`src/public/uploads/${property.image}`);
  }

  await property.destroy();

  res.redirect("/my-properties");
};

export {
  propertiesView,
  createPropertyView,
  createProperty,
  addImageView,
  saveImage,
  editPropertyView,
  editProperty,
  deleteProperty,
};
