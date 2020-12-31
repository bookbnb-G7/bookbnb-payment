const { database } = require('../db')
const Sequelize = require('sequelize')

// as we need to create an entrance to the db but
// we cant wait until the contract return roomId,
// we set a default id as primary

const Room = database.define('Rooms', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  price: { type: Sequelize.INTEGER, allowNull: false },
  ownerId: { type: Sequelize.INTEGER, allowNull: false },
  transactionStatus: { type: Sequelize.INTEGER, allowNull: false},
  transactionHash: { type: Sequelize.STRING(512), allowNull: false}
})

module.exports = { Room };