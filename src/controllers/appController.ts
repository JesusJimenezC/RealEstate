import type { Request, Response } from "express";
import { Category, Price, Property } from "../models";

const home = async (_req: Request, res: Response): Promise<void> => {
  const [categories, prices, warehouses, departments] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: {
        categoryIdFK: 5,
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
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: {
        categoryIdFK: 2,
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
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("home", {
    page: "Home",
    categories,
    prices,
    warehouses,
    departments,
  });
};

const categories = (_req: Request, res: Response): void => {
  res.render("category");
};

const notFound = (_req: Request, res: Response): void => {
  res.render("404");
};

const search = (_req: Request, res: Response): void => {
  res.render("search");
};

export { home, categories, notFound, search };
