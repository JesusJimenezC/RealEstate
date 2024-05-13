import {
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  DataTypes,
  type CreationOptional,
} from "sequelize";
import db from "../config/db.ts";

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>;
  declare name: string;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Category",
    timestamps: false,
    tableName: "categories",
  },
);

export default Category;
