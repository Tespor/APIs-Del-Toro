const {DataTypes, model, INTEGER} = require ('sequelize');
const sequelize = require ('../utils/database');
const { timestamp } = require('rxjs');

class Profesor extends model{}

Profesor.init(
    {
        id : {
            type: DataTypes.INTEGER,
            primarykey: true,
            allowNull: false
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        apellidoP : {
            type: DataTypes.STRING,
            allowNull: false
        },

        apellidoM: {
            type : DataTypes.STRING,
            allowNull: false
        },

        correo_electronico : {
            type: DataTypes.STRING,
            allowNull: false
        },

        telefono : {
            type : Datatypes.STRING,
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
