export default (sequelize, DataTypes) => {
  // Model definition
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      isUnique: true,
      primaryKey: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archivedBy: {
      type: DataTypes.ARRAY(DataTypes.STRING(36)),
      defaultValue: null,
    },
  });

  // Model associations
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: "senderId",
    });
    Message.belongsTo(models.User, {
      foreignKey: "recipientId",
    });
  };

  return Message;
};
