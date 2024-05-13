import { Sequelize } from "sequelize";

const DATABASE: string = process.env.BD_NAME!;
const USERNAME: string = process.env.BD_USER!;
const PASSWORD: string = process.env.BD_PASSWORD!;
const HOST: string = process.env.BD_HOST!;

const db: Sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: 3306,
  dialect: "mysql",
  define: {
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // time to make a connection
    idle: 10000, // time to break a connection if is not used
  },
});

export default db;
