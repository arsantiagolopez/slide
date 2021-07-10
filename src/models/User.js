export default (sequelize, DataTypes) => {
  // Model definition
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
      isUnique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT,
    },
  });

  // Model associations
  User.associate = (models) => {};

  return User;
};
