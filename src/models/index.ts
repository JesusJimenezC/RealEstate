import Property from "./Property.ts";
import Price from "./Price.ts";
import Category from "./Category.ts";
import User from "./User.ts";

Property.belongsTo(Price, { foreignKey: "priceIdFK", as: "price" });
Property.belongsTo(Category, { foreignKey: "categoryIdFK", as: "category" });
Property.belongsTo(User, { foreignKey: "userIdFK", as: "user" });

export { Property, Price, Category, User };
