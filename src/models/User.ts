import {
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  DataTypes,
  type CreationOptional,
} from "sequelize";
import db from "../config/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare token: string | null;
  declare verified: CreationOptional<boolean>;

  async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async generateJWT(): Promise<string> {
    return jwt.sign(
      {
        id: this.id,
        name: this.name,
      },
      process.env.JWT_SECRET || "secret_key",
      {
        expiresIn: "1d",
      },
    );
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    token: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    timestamps: true,
    tableName: "users",
    hooks: {
      beforeCreate: async (user: User): Promise<void> => {
        user.password = await user.hashPassword(user.password);
      },
    },
    scopes: {
      removePassword: {
        attributes: {
          exclude: ["password", "token", "verified", "createdAt", "updatedAt"],
        },
      },
    },
  },
);

export default User;
