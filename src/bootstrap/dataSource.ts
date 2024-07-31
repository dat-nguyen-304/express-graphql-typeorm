import { DataSource } from "typeorm";
import "dotenv/config";

const baseDir = "src";

export const appDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "123456",
  database: "migrate-apollo",
  synchronize: true,
  entities: [`${baseDir}/modules/**/*.{js,ts}`],
  migrations: [`${baseDir}/migration/*.{js,ts}`],
  connectTimeout: 20000,
  logging: true,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
