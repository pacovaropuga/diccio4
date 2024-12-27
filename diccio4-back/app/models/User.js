'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
       
    static associate(models) {
      // define association here
    }
  };
  User.init({
    idUser: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.INTEGER, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    score: DataTypes.DOUBLE,
    date_insert: DataTypes.DATE,
    date_last_update: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: false
  });
  return User;
};
