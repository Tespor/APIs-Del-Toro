const { DataTypes, Model } = require('sequelize');
const MySQL = require('../utils/database');

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fk_token: {
        type: DataTypes.TEXT
    }
  },
  {
    sequelize: MySQL.getSequelize,
    timestamps: false,
    modelName: "user"
  }
);

User.tableName = "user";

module.exports = User;