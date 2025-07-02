const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        permissions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        modelName: 'User',
        tableName: 'USERS',
        timestamps: false
    }
);

module.exports = User;