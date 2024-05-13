import {
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  DataTypes,
  type CreationOptional,
} from "sequelize";
import db from "../config/db.ts";

class Price extends Model<
  InferAttributes<Price>,
  InferCreationAttributes<Price>
> {
  declare id: CreationOptional<number>;
  declare name: string;
}

Price.init(
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
    modelName: "Price",
    timestamps: false,
    tableName: "prices",
  },
);

export default Price;
