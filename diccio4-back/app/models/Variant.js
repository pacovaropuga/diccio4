'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    
    static associate(models) {
      // define association here
    }
  };
  Variant.init({
    idVariant: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    idVariantOriginal: DataTypes.INTEGER,
    variant: {type: DataTypes.STRING, allowNull: false},
    grammar: DataTypes.STRING,
    simple: {type: DataTypes.STRING, allowNull: false}
  }, {
    sequelize,
    modelName: 'Variant',
    tableName: 'Variant',
    timestamps: false
  });
  return Variant;
};