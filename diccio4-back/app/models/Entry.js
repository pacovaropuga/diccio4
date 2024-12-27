'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    
    static associate(models) {
      // define association here
    }
  };
  Entry.init({
    idEntry: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    idTerm: {type: DataTypes.INTEGER, allowNull: false},
    entry: {type: DataTypes.INTEGER, allowNull: false},
    idEntryOriginal: DataTypes.INTEGER,
    idCreator: {type: DataTypes.INTEGER, allowNull: false},
    idStatus: {type: DataTypes.INTEGER, allowNull: false},
    idAction: DataTypes.INTEGER,
    idValidator: DataTypes.INTEGER,
    note: DataTypes.STRING,
    annotation: DataTypes.STRING,
    grammar: DataTypes.STRING,
    codex: DataTypes.STRING,
    record: DataTypes.STRING,
    date_insert: DataTypes.DATE,
    date_last_update: DataTypes.DATE,
    date_validation: DataTypes.DATE,
    EntryVisualization: {type: DataTypes.STRING, allowNull: false},
    audioEnglish: DataTypes.STRING,
    audioUsa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Entry',
    tableName: 'Entry',
    timestamps: false
  });
  return Entry;
};