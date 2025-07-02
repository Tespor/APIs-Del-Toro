const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database'); 

class Curso extends Model {}

Curso.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nombre_curso:{
        type: DataTypes.STRING,
        allowNull: false
    },
    profesor_id:{
        type: DataTypes.INTEGER,
        references:{
            model:profesores,
            key: id
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
