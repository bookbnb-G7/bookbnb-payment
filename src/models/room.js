const { database } = require('../db')
const Sequelize = require('sequelize')

const Room = database.define('Rooms', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: false },
  price: { type: Sequelize.INTEGER, allowNull: false },
  ownerId: { type: Sequelize.INTEGER, allowNull: false },
  transactionHash: { type: Sequelize.STRING(512), allowNull: false}
})

module.exports = { Room };