const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');
const Profesor = require('../models/profesor.model');

class Curso extends Model { }

Curso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true
    },
    nombre_curso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profesor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profesor,
        key: Profesor.id
      }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'Curso',
    tableName: 'cursos',
    timestamps: false
  }
);

module.exports = Curso;
