const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class Alumno extends Model { }

Alumno.init(
  {
    matricula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
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
    
  },
  {
    sequelize: sequelize,
    modelName: 'Alumno',
    tableName: 'alumnos',
    timestamps: false
  }
);

module.exports = Alumno;
