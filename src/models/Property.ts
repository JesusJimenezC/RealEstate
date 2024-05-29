import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import Price from "./Price";
import Category from "./Category";
import User from "./User";
import Message from "./Message";

@Table({ tableName: "properties", timestamps: true })
export default class Property extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare rooms: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare parking: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare wc: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  declare street: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare lat: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare lng: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare image: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare published: boolean;

  @ForeignKey(() => Price)
  @Column
  declare priceIdFK: string;

  @ForeignKey(() => Category)
  @Column
  declare categoryIdFK: string;

  @ForeignKey(() => User)
  @Column
  declare userIdFK: string;

  @BelongsTo(() => Price)
  declare price: Price;

  @BelongsTo(() => Category)
  declare category: Category;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Message)
  declare messages: Message[];
}
