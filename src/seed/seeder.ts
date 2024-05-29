import { exit } from "node:process";
import db from "../config/db.ts";
import categories from "./categories.ts";
import prices from "./prices.ts";
import User from "../models/User";
import Category from "../models/Category";
import Price from "../models/Price";
import users from "./users.ts";

const importData = async (): Promise<void> => {
  try {
    // Auth
    await db.authenticate();

    // Generate columns
    await db.sync();

    // Insert data
    await Promise.all([
      Category.bulkCreate(categories),
      Price.bulkCreate(prices),
      User.bulkCreate(users),
    ]);

    console.log("Data Imported");
    exit(0);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const deleteData = async (): Promise<void> => {
  try {
    // Auth
    await db.authenticate();
    await db.sync();

    await Promise.all([
      Category.destroy({ where: {}, truncate: true }),
      Price.destroy({ where: {}, truncate: true }),
      User.destroy({ where: {}, truncate: true }),
    ]);

    console.log("Data Deleted");
    exit(0);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData().then((r: void) => r);
} else if (process.argv[2] === "-d") {
  deleteData().then((r: void) => r);
}
