import {
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  DataTypes,
  type CreationOptional,
  type ForeignKey,
} from "sequelize";
import db from "../config/db.ts";
import type Price from "./Price.ts";
import type Category from "./Category.ts";
import type User from "./User.ts";

class Property extends Model<
  InferAttributes<Property>,
  InferCreationAttributes<Property>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare rooms: number;
  declare parking: number;
  declare wc: number;
  declare street: string;
  declare lat: string;
  declare lng: string;
  declare image: string;
  declare published: CreationOptional<boolean>;

  declare priceIdFK: ForeignKey<Price["id"]>;
  declare categoryIdFK: ForeignKey<Category["id"]>;
  declare userIdFK: ForeignKey<User["id"]>;
}

Property.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    rooms: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    parking: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    wc: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    street: {
      type: new DataTypes.STRING(60),
      allowNull: false,
    },
    lat: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    lng: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    image: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "Property",
    timestamps: true,
    tableName: "properties",
  },
);

export default Property;
