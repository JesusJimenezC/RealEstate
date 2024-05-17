import type { Request, Response } from "express";
import { Category, Price, Property } from "../models";

const properties = async (_req: Request, res: Response): Promise<void> => {
  const properties = await Property.findAll({
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

  res.json(properties);
};

export { properties };
