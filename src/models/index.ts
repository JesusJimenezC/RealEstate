import Property from "./Property.ts";
import Price from "./Price.ts";
import Category from "./Category.ts";
import User from "./User.ts";

Property.belongsTo(Price, { foreignKey: "priceIdFK" });
Property.belongsTo(Category, { foreignKey: "categoryIdFK" });
Property.belongsTo(User, { foreignKey: "userIdFK" });

export { Property, Price, Category, User };
