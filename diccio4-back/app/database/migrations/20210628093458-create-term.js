'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Terms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTerm: {
        type: Sequelize.INTEGER
      },
      term: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      hit: {
        type: Sequelize.INTEGER
      },
      thesaurus: {
        type: Sequelize.STRING
      },
      audioEnglish: {
        type: Sequelize.STRING
      },
      audioUSA: {
        type: Sequelize.STRING
      },
      date_insert: {
        type: Sequelize.DATE
      },
      date_last_update: {
        type: Sequelize.DATE
      },
      date_last_hit: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Terms');
  }
};