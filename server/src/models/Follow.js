export default (sequelize, DataTypes) => {
  // Model definition
  const Follow = sequelize.define("Follow", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      isUnique: true,
      primaryKey: true,
    },
  });

  // Model associations
  Follow.associate = (models) => {};

  return Follow;
};
