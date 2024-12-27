'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Term extends Model {
    
    static associate(models) {
      // define association here
    }
  };
  Term.init({
    idTerm: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    term: {type: DataTypes.STRING, allowNull: false},
    language: {type: DataTypes.STRING, allowNull: false},
    hit: DataTypes.INTEGER,
    thesaurus: DataTypes.STRING,
    audioEnglish: DataTypes.STRING,
    audioUSA: DataTypes.STRING,
    date_insert: DataTypes.DATE,
    date_last_update: DataTypes.DATE,
    date_last_hit: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Term',
    tableName: 'Term',
    timestamps: false
  });
  return Term;
};