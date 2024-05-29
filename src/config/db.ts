import { Sequelize } from "sequelize-typescript";
import path from "path";

const DATABASE: string = process.env.BD_NAME!;
const USERNAME: string = process.env.BD_USER!;
const PASSWORD: string = process.env.BD_PASSWORD!;
const HOST: string = process.env.BD_HOST!;

const sequelize = new Sequelize({
  database: DATABASE,
  username: USERNAME,
  password: PASSWORD,
  host: HOST,
  port: 3306,
  dialect: "mysql",
  models: [path.join(__dirname, "../models")], // path to your models
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
