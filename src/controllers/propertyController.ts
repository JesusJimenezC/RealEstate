import type { NextFunction, Request, Response } from "express";
import {
  type Result,
  type ValidationError,
  validationResult,
} from "express-validator";
import { unlink } from "node:fs/promises";
import { isOwner } from "../helpers";
import Property from "../models/Property";
import Price from "../models/Price";
import Category from "../models/Category";
import Message from "../models/Message";
import User from "../models/User.ts";

const propertiesView = async (req: Request, res: Response): Promise<void> => {
  const { page: currentPage } = req.query;
  const expression = /^[1-9]$/;

  if (!expression.test(<string>currentPage)) {
    return res.redirect("/my-properties?page=1");
  }

  try {
    const { id } = req.user ?? { id: undefined };
    const limit = 10;
    const offset = Number(currentPage) * limit - limit;

    const [properties, total] = await Promise.all([
      await Property.findAll({
        limit,
        offset,
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
          {
            model: Message,
            as: "messages",
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
      await Property.count({
        where: {
          userIdFK: id,
        },
      }),
    ]);

    res.render("properties/admin", {
      page: "My Properties",
      properties,
      csrfToken: req.csrfToken(),
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/my-properties");
  }
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

  if (
    !property ||
    property.published ||
    Number(property.userIdFK) !== req.user?.id
  ) {
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

  if (
    !property ||
    property.published ||
    Number(property.userIdFK) !== req.user?.id
  ) {
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

  if (!property || Number(property.userIdFK) !== req.user?.id) {
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

  if (!property || Number(property.userIdFK) !== req.user?.id) {
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

  if (!property || Number(property.userIdFK) !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  if (property.image) {
    await unlink(`src/public/uploads/${property.image}`);
  }

  await property.destroy();

  res.redirect("/my-properties");
};

const modifyStateProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id);

  if (!property || Number(property.userIdFK) !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  property.published = !property.published;

  await property.save();

  res.json({
    result: true,
  });
};

const showPropertyView = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const categories = await Category.findAll();

  const property: Property | null = await Property.findByPk(id, {
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

  if (!property || !property.published) {
    return res.redirect("/404");
  }

  res.render("properties/show", {
    page: property.title,
    property,
    categories,
    csrfToken: req.csrfToken(),
    user: req.user,
    isOwner: isOwner(req.user?.id ?? NaN, Number(property.userIdFK)),
  });
};

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { propertyId: id } = req.params;

  const categories = await Category.findAll();

  const property: Property | null = await Property.findByPk(id, {
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

  if (!property) {
    return res.redirect("/404");
  }

  const result: Result<ValidationError> = validationResult(req);

  if (!result.isEmpty()) {
    res.render("properties/show", {
      page: property.title,
      property,
      categories,
      csrfToken: req.csrfToken(),
      user: req.user,
      isOwner: isOwner(req.user?.id ?? NaN, Number(property.userIdFK)),
      errors: result.array(),
    });

    return;
  }

  await Message.create({
    message: req.body.message,
    propertyIdFK: req.params.propertyId,
    userIdFK: req.user?.id,
  });

  res.render("properties/show", {
    page: property.title,
    property,
    categories,
    csrfToken: req.csrfToken(),
    user: req.user,
    isOwner: isOwner(req.user?.id ?? NaN, Number(property.userIdFK)),
    sent: true,
  });
};

const readMessages = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const property: Property | null = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        as: "messages",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  if (!property || Number(property.userIdFK) !== req.user?.id) {
    return res.redirect("/my-properties");
  }

  res.render("properties/messages", {
    page: "Messages",
    messages: property.messages,
  });
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
  showPropertyView,
  sendMessage,
  readMessages,
  modifyStateProperty,
};
