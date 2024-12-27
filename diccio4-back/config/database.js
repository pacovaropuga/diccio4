require('dotenv').config()

module.exports = {

    // Database configuration
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host:     process.env.DB_HOST,
    dialect:  process.env.DB_DIALECT,
    port:     process.env.DB_PORT,
    dialectOptions: {
        multipleStatements: true
    },
    // Seeders configuration
    seederStorage: "sequelize",
    seederStorageTableName: "seeds",
    // Migrations configurations
    migrationStorage: "sequelize",
    migrationStorageTableName: "migrations"
    
}
