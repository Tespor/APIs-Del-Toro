const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class Profesor extends Model { }

Profesor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        apellidoP: {
            type: DataTypes.STRING,
            allowNull: false
        },

        apellidoM: {
            type: DataTypes.STRING,
            allowNull: false
        },

        correo_electronico: {
            type: DataTypes.STRING,
            allowNull: false
        },

        telefono: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permissions: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Profesor',
        tableName: 'profesores',
        timestamps: false
    }
);

module.exports = Profesor;
