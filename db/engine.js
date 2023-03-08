import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("matchub", "test", "test1234.", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to MySQL established");
  })
  .catch((err) => {
    console.error("Failed to establish connection to MySQL", err);
  });
