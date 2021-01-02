const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../ultis');
const { Booking, BookingStatus } = require('../models/booking');
const { toWei, getContract, daysBetween, sqlDateonlyToDate } = require('../ultis');

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

const _checkEventDate = async (eventToCheck, date) => {
  const { day, month, year } = eventToCheck.returnValues;
  return new Date(year, month, day) === date;
}

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
  const bookingPrice = targetRoom.price * days;

  console.log('dateFrom');
  console.log(bookingPrice);

  console.log('dateFrom');
  console.log(dateFrom.getDate(), dateFrom.getMonth(), dateFrom.getFullYear());

  console.log('dateTo');
  console.log(dateTo.getDate(), dateTo.getMonth(), dateTo.getFullYear());


  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].intentBookingBatch(
      roomId - 1,
      dateFrom.getDate(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth(), dateTo.getFullYear()
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
        return resolve(newIntentBooking.toJSON());
      })
    })
    .on('receipt', (r) => {
      if (r.events.BookIntentCreated && _checkEventDate(r.events.BookIntentCreated, dateTo)) {

        console.log("ROOM BOOKING RETURN VALUES");
        console.log(r.events.BookIntentCreated.returnValues);

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

const getPendingBookings = async (roomOwnerId) => {
  // returns all the bookings that were made to the
  // from the rooms which the user roomOwnerId is the
  // owner and that has a pending state
  return Booking.findAll({where: {
      roomOwnerId: roomOwnerId,
      bookingStatus: BookingStatus.pending
    } }).then((pendingBookings) => {
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
      dateFrom.getDate(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth(), dateTo.getDay()
    )
    .send({ from: ownerWallet.address })
    .on('receipt', (r) => {
      if (process.env.ENVIRONMENT === 'testing') {
        _changeBookingStatus(bookingId, BookingStatus.accepted);
        _changeTransactionStatus(bookingId, TransactionStatus.confirmed);
        booking.bookingStatus = BookingStatus.accepted;
        return resolve(booking);
      }

      if (r.events.RoomBooked && _checkEventDate(r.events.RoomBooked, booking.dateTo)) {
        _changeBookingStatus(bookingId, BookingStatus.accepted);
        _changeTransactionStatus(bookingId, TransactionStatus.confirmed);
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
      dateFrom.getDate(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDate(), dateTo.getMonth(), dateTo.getDay()
    )
      .send({ from: ownerWallet.address })
      .on('receipt', (r) => {
        if (process.env.ENVIRONMENT === 'testing') {
          _changeBookingStatus(booking.id, BookingStatus.rejected);
          booking.bookingStatus = BookingStatus.rejected;
          return resolve(booking);
        }

        if (r.events.RoomBooked &&) {
          console.log('events', r.events.RoomBooked);
          _changeBookingStatus(booking.id, BookingStatus.rejected);
          booking.bookingStatus = BookingStatus.rejected;
          return resolve(booking);
        }
      })
      .on('error', (err) => reject(err));
  });
};

module.exports = ({ config }) => ({
  getBooking: getBooking,
  getPendingBookings: getPendingBookings,
  acceptBooking: acceptBooking({ config }),
  rejectBooking: rejectBooking({ config }),
  createIntentBook: createIntentBook({ config }),
});