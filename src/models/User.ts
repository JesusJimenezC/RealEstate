import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  BeforeCreate,
  Scopes,
  AutoIncrement,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Table({ tableName: "users", timestamps: true })
@Scopes(() => ({
  removePassword: {
    attributes: {
      exclude: ["password", "token", "verified", "createdAt", "updatedAt"],
    },
  },
}))
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare password: string;

  @AllowNull(true)
  @Column(DataType.STRING(128))
  declare token: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare verified: boolean;

  async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async generateJWT(): Promise<string> {
    return jwt.sign(
      {
        id: this.id,
        name: this.name,
      },
      process.env.JWT_SECRET_KEY || "secret_key",
      {
        expiresIn: "1d",
      },
    );
  }

  async hashPassword(password: string): Promise<string> {
    return (this.password = await bcrypt.hash(password, 10));
  }

  @BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
  }
}
