'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idEntry: {
        type: Sequelize.INTEGER
      },
      idTerm: {
        type: Sequelize.INTEGER
      },
      entry: {
        type: Sequelize.INTEGER
      },
      idEntryOriginal: {
        type: Sequelize.INTEGER
      },
      idCreator: {
        type: Sequelize.INTEGER
      },
      idStatus: {
        type: Sequelize.INTEGER
      },
      idAction: {
        type: Sequelize.INTEGER
      },
      idValidator: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      annotation: {
        type: Sequelize.STRING
      },
      grammar: {
        type: Sequelize.STRING
      },
      codex: {
        type: Sequelize.STRING
      },
      record: {
        type: Sequelize.STRING
      },
      date_insert: {
        type: Sequelize.DATE
      },
      date_last_update: {
        type: Sequelize.DATE
      },
      date_validation: {
        type: Sequelize.DATE
      },
      EntryVisualization: {
        type: Sequelize.STRING
      },
      audioEnglish: {
        type: Sequelize.STRING
      },
      audioUsa: {
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
    await queryInterface.dropTable('Entries');
  }
};