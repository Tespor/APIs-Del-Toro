const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database'); 
const Curso = require('./curso.model');

class Alumno_Curso extends Model {}

Alumno_Curso.init(
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : true
        },
        matricula : {
            type : DataTypes.STRING,
            allowNull : false
        },
        curso_id : {
            type : DataTypes.STRING,
            allowNull : false,
            references : {
                model : Curso,
                key : Curso.id
            }
        }
    },
    {
        sequelize : sequelize,
        modelName : 'Alumno_Curso',
        tableName : 'alumno_curso',
        timestamps : false
    }
);

module.exports = Alumno_Curso;