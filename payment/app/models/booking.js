const { database } = require('../db');
const Sequelize = require('sequelize');

const BookingStatus = Object.freeze({
  "pending": 1,
  "accepted": 2,
  "rejected": 3
});

const Booking = database.define('Bookings', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

  price: { type: Sequelize.INTEGER, allowNull: false },
  roomId: { type: Sequelize.INTEGER, allowNull: false },
  bookerId: { type: Sequelize.INTEGER, allowNull: false },
  roomOwnerId: { type: Sequelize.INTEGER, allowNull: false},

  dateFrom: { type: Sequelize.DATEONLY, allowNull: false },
  dateTo: { type: Sequelize.DATEONLY, allowNull: false },

  bookingStatus: { type: Sequelize.INTEGER, allowNull: false },
  transactionStatus: { type: Sequelize.INTEGER, allowNull: false},

  transactionHash: { type: Sequelize.STRING(512), allowNull: false},
});

module.exports = {
  Booking,
  BookingStatus
};