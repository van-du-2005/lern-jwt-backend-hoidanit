import Sequelize from "sequelize";

const sequelize = new Sequelize("jwt_react_node", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

const testConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


export default testConnect;