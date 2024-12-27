'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Variants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idVariant: {
        type: Sequelize.INTEGER
      },
      idVariantOriginal: {
        type: Sequelize.INTEGER
      },
      variant: {
        type: Sequelize.STRING
      },
      grammar: {
        type: Sequelize.STRING
      },
      simple: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Variants');
  }
};