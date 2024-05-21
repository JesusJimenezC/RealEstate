import type { Request, Response } from "express";
import { Category, Price, Property } from "../models";
import { Op } from "sequelize";

const homeView = async (req: Request, res: Response): Promise<void> => {
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
    csrfToken: req.csrfToken(),
  });
};

const categoriesView = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const categories = await Category.findAll({ raw: true });
  const category = await Category.findByPk(id);

  if (!category) {
    res.redirect("/404");
    return;
  }

  const properties = await Property.findAll({
    where: {
      categoryIdFK: id,
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
  });

  res.render("categories", {
    page: category.name,
    category,
    properties,
    categories,
    csrfToken: req.csrfToken(),
  });
};

const notFoundView = async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.findAll({ raw: true });

  res.render("404", {
    page: "404 - Not Found",
    categories,
    csrfToken: req.csrfToken(),
  });
};

const search = async (req: Request, res: Response): Promise<void> => {
  const { term } = req.body;

  if (!term.trim()) return res.redirect("back");

  const properties = await Property.findAll({
    where: {
      title: {
        [Op.like]: `%${term}%`,
      },
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
  });

  const categories = await Category.findAll({ raw: true });

  res.render("search", {
    page: "Search Results",
    properties,
    categories,
    csrfToken: req.csrfToken(),
  });
};

export { homeView, categoriesView, notFoundView, search };
