const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../utils');
const { Booking, BookingStatus } = require('../models/booking');
const { toWei, getContract, daysBetween, sqlDateonlyToDate } = require('../utils');
const { Op } = require("sequelize");

const _changeTransactionStatus = async (transactionHash, newStatus) => {
  Booking.findOne({where: {transactionHash: transactionHash}}).then((booking) => {
    if (booking) {
      booking.update({transactionStatus: newStatus}).then(() => {
        return true;
      });
    }
  });
};

const _changeBookingStatus = async (bookingId, newStatus) => {
  Booking.findOne({where: {id: bookingId}}).then((booking) => {
    if (booking) {
      booking.update({bookingStatus: newStatus}).then(() => {
        return true;
      });
    }
  });
};

const _getRoom = async (roomId) => {
  return Room.findOne({ where: {id: roomId} }).then((room) => {
    if (room) {
      return room.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};

const _getWallet = async (uuid) => {
  return Wallet.findOne({ where: {uuid: uuid} }).then((wallet) => {
    if (wallet) {
      return wallet.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};


const createIntentBook = ({ config }) => async (web3, bookerId, roomId, dateFrom, dateTo) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const bookerWallet = await web3.eth.getAccounts();
  const targetRoom = await _getRoom(roomId);

  const days = daysBetween(dateFrom, dateTo) + 1;
  const bookingPrice = targetRoom.price * days * 0.001;

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].intentBookingBatch(
      roomId,
      dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth() + 1, dateTo.getFullYear()
    )
    .send({
      from: bookerWallet[0],
      value: toWei(bookingPrice)
    })
    .on('transactionHash', (hash) => {
      Booking.create({
        price: bookingPrice,

        roomId: roomId,
        bookerId: bookerId,
        roomOwnerId: targetRoom.ownerId,

        dateFrom: dateFrom,
        dateTo: dateTo,

        bookingStatus: BookingStatus.pending,
        transactionStatus: TransactionStatus.pending,

        transactionHash: hash
      }).then((newIntentBooking) => {
        console.log('new booking:')
        console.log(newIntentBooking);
        return resolve(newIntentBooking.toJSON());
      })
    })
    .on('receipt', (r) => {
      if (r.events.BookIntentCreated) {
        _changeTransactionStatus(
          r.transactionHash,
          TransactionStatus.confirmed
        );
      }
    })
    .on('error', (err) => reject(err));
  });
};

const getBooking = async (bookingId) => {
  return Booking.findOne({ where: {id: bookingId} }).then((booking) => {
    if (booking) {
      return booking.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};

const getBookings = async (queryParams) => {
  let query = {where: {}};

  if (queryParams.bookerId) {
    query.where.bookerId = queryParams.bookerId;
  }

  if (queryParams.roomOwnerId) {
    query.where.roomOwnerId = queryParams.roomOwnerId;
  }

  if (queryParams.roomId) {
    query.where.roomId = queryParams.roomId;
  }

  if (queryParams.bookingStatus) {
    query.where.bookingStatus = queryParams.bookingStatus;
  }

  return Booking.findAll(query).then((pendingBookings) => {
    return pendingBookings;
  })
}

const acceptBooking = ({ config }) => async (web3, bookingId) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const booking = await getBooking(bookingId);

  const bookerWallet = await _getWallet(booking.bookerId);
  const ownerWallet = await _getWallet(booking.roomOwnerId);

  const dateFrom = sqlDateonlyToDate(booking.dateFrom);
  const dateTo = sqlDateonlyToDate(booking.dateTo);

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].acceptBatch(
      booking.roomId,
      bookerWallet.address,
      dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth() + 1, dateTo.getFullYear()
    )
    .send({ from: ownerWallet.address })
    .on('receipt', (r) => {
      console.log('events: ', r.events);

      if (process.env.ENVIRONMENT === 'testing') {
        _changeBookingStatus(bookingId, BookingStatus.accepted);
        booking.bookingStatus = BookingStatus.accepted;
        return resolve(booking);
      }

      if (r.events.RoomBooked) {
        _changeBookingStatus(bookingId, BookingStatus.accepted);
        booking.bookingStatus = BookingStatus.accepted;
        return resolve(booking);
      }
    })
    .on('error', (err) => reject(err));
  });
};

const rejectBooking = ({ config }) => async (web3, bookingId) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const booking = await getBooking(bookingId);

  const bookerWallet = await _getWallet(booking.bookerId);
  const ownerWallet = await _getWallet(booking.roomOwnerId);

  const dateFrom = sqlDateonlyToDate(booking.dateFrom);
  const dateTo = sqlDateonlyToDate(booking.dateTo);

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].rejectBatch(
      booking.roomId,
      bookerWallet.address,
      dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth() + 1, dateTo.getFullYear()
    )
    .send({ from: ownerWallet.address })
    .on('receipt', (r) => {
      if (process.env.ENVIRONMENT === 'testing') {
        _changeBookingStatus(booking.id, BookingStatus.rejected);
        booking.bookingStatus = BookingStatus.rejected;
        return resolve(booking);
      }

      if (r.events.BookIntentRejected) {
        _changeBookingStatus(booking.id, BookingStatus.rejected);
        booking.bookingStatus = BookingStatus.rejected;
        return resolve(booking);
      }
    })
    .on('error', (err) => reject(err));
  });
};

const deleteBooking = async (bookingId) => {
  return Booking.findOne({ where: {id: bookingId} }).then((booking) => {
    if (booking) {
      return booking.toJSON();
    } else {
      return {error: "not found"};
    }
  });
}

const bookingsOnSameDate = ({ config }) => async (roomId, searchDateFrom, searchDateTo) =>{
  let bookingsCond1 = await Booking.findAll({ where: {
                                                  roomId: roomId,
                                                  dateFrom: { [Op.gte]: searchDateFrom },
                                                  dateTo: { [Op.lte]: searchDateTo },
                                                  bookingStatus: { [Op.ne]: 3 },
                                                } });
  
  let bookingsCond2 = await Booking.findAll({ where: {
                                                  roomId: roomId,
                                                  dateFrom: { [Op.lte]: searchDateFrom },
                                                  dateTo: { [Op.gte]: searchDateFrom },
                                                  bookingStatus: { [Op.ne]: 3 },
                                                } });

  let bookingsCond3 = await Booking.findAll({ where: {
                                                  roomId: roomId,
                                                  dateFrom: { [Op.lte]: searchDateTo },
                                                  dateTo: { [Op.gte]: searchDateTo },
                                                  bookingStatus: { [Op.ne]: 3 },
                                                } });
                                                
  let bookings = [...bookingsCond1, ...bookingsCond2];
  bookings = [...bookings, ...bookingsCond3];
  return bookings.length;
}


module.exports = ({ config }) => ({
  getBooking: getBooking,
  getBookings: getBookings,
  deleteBooking: deleteBooking,
  acceptBooking: acceptBooking({ config }),
  rejectBooking: rejectBooking({ config }),
  createIntentBook: createIntentBook({ config }),
  bookingsOnSameDate: bookingsOnSameDate({ config }),
});