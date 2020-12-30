const { database } = require('../db')
const Sequelize = require('sequelize')

const Wallet = database.define('Wallets', {
  uuid: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: false },
  address: { type: Sequelize.STRING(256), allowNull: false},
  mnemonic: { type: Sequelize.STRING(256), allowNull: false}
})

module.exports = { Wallet };