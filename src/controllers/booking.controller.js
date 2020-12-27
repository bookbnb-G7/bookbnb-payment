const { getRoom } = require('../controllers/room.controller');
const { toWei, getContract, daysBetween } = require('../ultis');
const { getWallet } = require('../controllers/wallet.controller')
const { Booking, BookingStatus, TransactionStatus } = require('../models/booking');

const _changeTransactionStatus = async (transactionHash, newStatus) => {
  Booking.findOne({where: {transactionHash: transactionHash}}).then((booking) => {
    if (booking) {
      booking.update({transactionStatus: newStatus}).then(() => {
        return true;
      });
    }
  });
};

const _changeBookingStatus = async (roomId, dateFrom, dateTo, newStatus) => {
  Booking.findOne({where: {roomId: roomId, dateFrom: dateFrom, dateTo: dateTo}}).then((booking) => {
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


const createIntentBook = ({ config }) => async (web3, bookerId, roomId, dateFrom, dateTo) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const bookerWallet = getWallet(bookerId);
  const targetRoom = getRoom(roomId);

  const days = daysBetween(dateFrom, dateTo);
  const bookingPrice = targetRoom.price * days;

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.intentBookingBatch(
      roomId,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getFullYear()
    )
    .send({
      from: bookerWallet.address,
      value: toWei(bookingPrice)
    })
    .on('transactionHash', (hash) => {
      Booking.create({
        price: bookingPrice,
        roomId: roomId,
        bookerId: bookerId,

        dateFrom: dateFrom,
        dateTo: dateTo,

        bookingStatus: BookingStatus.notSpecified,
        transactionStatus: TransactionStatus.pending,

        transactionHash: hash
      }).then((newIntentBooking) => {
        return resolve(newIntentBooking.toJSON());
      })
    })
    .on('receipt', (r) => {
      if (r.events.BookIntentCreated && _checkEventDate(r.events.BookIntentCreated, dateTo)) {
        _changeTransactionStatus(
          r.transactionHash,
          TransactionStatus.confirmed
        );
      }
    })
    .on('error', (err) => reject(err));
  });
};

const acceptBooking = ({ config }) => async (web3, ownerId, bookerId, roomId, dateFrom, dateTo) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const ownerWallet = getWallet(ownerId);
  const bookerWallet = getWallet(bookerId);

  const gasPrice = 0;

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.acceptBatch(
      roomId,
      bookerWallet.address,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getDay()
    )
    .send({ from: ownerWallet.address, gasPrice: toWei(gasPrice) })
    .on('receipt', (r) => {
      if (r.events.RoomBooked && _checkEventDate(r.events.RoomBooked, dateTo)) {
        const { roomId } = r.events.RoomBooked.returnValues;
        _changeBookingStatus(roomId, dateFrom, dateTo, BookingStatus.accepted);
        return resolve({message: "room accepted successfully"});
      }
    })
    .on('error', (err) => reject(err));
  });
};

const rejectBooking = ({ config }) => async (web3, ownerId, bookerId, roomId, dateFrom, dateTo) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const ownerWallet = getWallet(ownerId);
  const bookerWallet = getWallet(bookerId);

  const gasPrice = 0;

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.rejectBatch(
      roomId,
      bookerWallet.address,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getDay()
    )
      .send({ from: ownerWallet.address,gasPrice: toWei(gasPrice) })
      .on('receipt', (r) => {
        if (r.events.BookIntentRejected && _checkEventDate(r.events.BookIntentRejected, dateTo)) {
          const { roomId } = r.events.RoomBooked.returnValues;
          _changeBookingStatus(roomId, dateFrom, dateTo, BookingStatus.rejected);
          return resolve({message: "room rejected successfully"});
        }
      })
      .on('error', (err) => reject(err));
  });
};


module.exports = ({ config }) => ({
  acceptBooking: acceptBooking({ config }),
  rejectBooking: rejectBooking({ config }),
  createIntentBook: createIntentBook({ config }),
});