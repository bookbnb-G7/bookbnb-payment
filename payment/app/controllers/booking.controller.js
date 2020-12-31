const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../ultis');
const { toWei, getContract, daysBetween } = require('../ultis');
const { Booking, BookingStatus } = require('../models/booking');

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
  let wallet = await Wallet.findOne({ where: {uuid: uuid} });
  if (!wallet) return {error: "not found"};
  return wallet
};

const createIntentBook = ({ config }) => async (web3, bookerId, roomId, dateFrom, dateTo) => {
  const bookbnbContract = await getContract(web3, config.contractAddress);

  const bookerWallet = await web3.eth.getAccounts();
  const targetRoom = await _getRoom(roomId);

  const days = daysBetween(dateFrom, dateTo) + 1;
  const bookingPrice = targetRoom.price * days;

  console.log('dateFrom');
  console.log(dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear());

  console.log('dateTo');
  console.log(dateTo.getDay(), dateTo.getMonth(), dateTo.getFullYear());


  return new Promise((resolve, reject) => {
    bookbnbContract.methods.intentBookingBatch(
      roomId,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getFullYear()
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

  const ownerWallet = _getWallet(ownerId);
  const bookerWallet = _getWallet(bookerId);

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.acceptBatch(
      roomId,
      bookerWallet.address,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getDay()
    )
    .send({ from: ownerWallet.address )
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

  const ownerWallet = _getWallet(ownerId);
  const bookerWallet = _getWallet(bookerId);

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.rejectBatch(
      roomId,
      bookerWallet.address,
      dateFrom.getDay(), dateFrom.getMonth(), dateFrom.getFullYear(),
      dateTo.getDay(), dateTo.getMonth(), dateTo.getDay()
    )
      .send({ from: ownerWallet.address })
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