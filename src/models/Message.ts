import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  PrimaryKey,
  AllowNull,
  BelongsTo,
  AutoIncrement,
} from "sequelize-typescript";
import User from "./User";
import Property from "./Property";

@Table({ tableName: "messages", timestamps: false })
export default class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare message: string;

  @ForeignKey(() => User)
  @Column
  declare userIdFK: number;

  @ForeignKey(() => Property)
  @Column
  declare propertyIdFK: number;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Property)
  declare property: Property;
}
