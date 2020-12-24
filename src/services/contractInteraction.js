const Wallets = require('./identities')
const BigNumber = require('bignumber.js');
const BookBnBAbi = require('../../abi/BnBooking').abi;

const getContract = (web3, address) => {
  return new web3.eth.Contract(BookBnBAbi, address);
};

const toWei = (number) => {
  const WEIS_IN_ETHER = new BigNumber(10).pow(18);
  return new BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const rooms = {};
const intentsPerRoom = {};
const bookingsPerRoom = {};

const createRoom = ({ config }) => async (web3, price, ownerId) => {
  const accounts = await web3.eth.getAccounts();
  const bookbnbContract = await getContract(web3, config.contractAddress);

  return new Promise((resolve, reject) => { // returns a hash
    bookbnbContract['methods']
      .createRoom(toWei(price))
      .send({ from: accounts[0] })
      .on('receipt', (r) => {
        if (r.events.RoomCreated) {
          const { roomId } = r.events.RoomCreated.returnValues;
          rooms[r.transactionHash] = {
            ...rooms[r.transactionHash], roomId, status: 'confirmed' };
          }
      })
      .on('transactionHash', function(hash) {
        rooms[hash] = {
          ownerWallet: accounts[0],
          price: price,
          ownerId: ownerId
        };
        return resolve(hash);
      })
      .on('error', (err) => reject(err));
  });
};

const getRoom = () => async (roomId) => {
  console.log(roomId);
  return rooms[roomId];
};

const createIntentBook = ({ config }) => async (web3, bookerId, roomId, days, dateStart) => {
  const accounts = await web3.eth.getAccounts();
  const bookbnbContract = await getContract(web3, config.contractAddress);

  let room = getRoom(roomId);
  let bookPrice = days * room.price;

  let day = 1;
  let month = 2;
  let year = 2020;

  return new Promise((resolve, reject) => {
    bookbnbContract['methods']
      .intentBook(
        roomId, day, month, year,
        {value: toWei(bookPrice)}
      )
      .send({ from: accounts[0] })
      .on('receipt', (r) => {
        if (r.events.BookIntentCreated) {
          const { roomId, owner } = r.events.BookIntentCreated.returnValues;

          if (intentsPerRoom[roomId] === undefined) {
            intentsPerRoom[roomId] = {}
          }

          intentsPerRoom[roomId][r.transactionHash] = {
            ...rooms[r.transactionHash], roomId, owner, status: 'confirmed'
          }
        }})
      .on('transactionHash', function(hash) {
        if (intentsPerRoom[roomId] === undefined) {
          intentsPerRoom[roomId] = {}
        }

        intentsPerRoom[hash][roomId] = {
          ownerWallet: accounts[0],
          price: bookPrice,
          roomId: roomId,
        };

        return resolve(hash);
      })
      .on('error', (err) => reject(err));
  })
};

const acceptBooking = ({ config }) => async (web3, roomId, booker, day, month, year) => {
  const bookBnb = await getContract(web3, config.contractAddress);
  return bookBnb.accept(roomId, booker, day, month, year);
};

const rejectBooking = ({ config }) => async (web3, roomId, booker, day, month, year) => {
  const bookBnb = await getContract(web3, config.contractAddress);
  return bookBnb.reject(roomId, booker, day, month, year);
};

module.exports = (dependencies) => ({
  getRoom: getRoom(dependencies),
  createRoom: createRoom(dependencies),
  acceptBooking: acceptBooking(dependencies),
  rejectBooking: rejectBooking(dependencies),
  createIntentBook: createIntentBook(dependencies),
});
