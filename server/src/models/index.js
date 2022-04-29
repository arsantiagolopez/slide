import Sequelize from "sequelize";
import Config from "../config";
import Follow from "./Follow";
import Message from "./Message";
import User from "./User";

const DATABASE_URL = Config.databaseUrl;
const NODE_ENV = Config.nodeEnv;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: console.log,
  define: {
    underscored: true,
  },
  // Heroku requires SSL
  ssl: NODE_ENV === "production" ? true : false,
  dialectOptions: {
    ...(NODE_ENV === "production" && {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
  },
});

const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Message: Message(sequelize, Sequelize.DataTypes),
  Follow: Follow(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;

export { sequelize };
