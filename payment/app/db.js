const Sequelize = require('sequelize');
require('dotenv').config();

const TESTING_DB_URL = 'sqlite:///./test.db'
const DATABASE_URL = process.env.DATABASE_URL;
const ENVIRONMENT = process.env.ENVIRONMENT;

let database = null;

if (ENVIRONMENT === 'production') {
  database = new Sequelize(DATABASE_URL ,{
    dialect: 'postgres',
    native:true,
    ssl:true,
    dialectOptions: {ssl: true},
    operatorsAliases: Sequelize.Op,
    define: {timestamp: false}
  })
}

if (ENVIRONMENT === 'development') {
  database = new Sequelize(DATABASE_URL ,{
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,
    define: {timestamp: false},
    storage: './app.db'
  })

}

if (ENVIRONMENT === 'testing') {
  database = new Sequelize(TESTING_DB_URL ,{
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,
    define: {timestamp: false}
  })
}

module.exports = { database }