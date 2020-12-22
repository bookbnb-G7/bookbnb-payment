const BigNumber = require('bignumber.js');
const BookBnBAbi = require('../../abi/BnBooking').abi;

const getContract = (web3, address) => {
  return new web3.eth.Contract(BookBnBAbi, address);
};

const toWei = (number) => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const rooms = {};

const bookingsPerRoom = {};

const intentsPerRoom = {};

const createRoom = ({ config }) => async (web3, price) => {
  const accounts = await web3.eth.getAccounts();
  const bookBnb = await getContract(web3, config.contractAddress);
  const hashPromise = new Promise((resolve, reject) => {
    bookBnb.methods
      .createRoom(toWei(price))
      .send({ from: accounts[0] })
      .on('receipt', (r) => {
        if (r.events.RoomCreated) {
          const { roomId } = r.events.RoomCreated.returnValues;
          rooms[r.transactionHash] = { ...rooms[r.transactionHash], roomId, status: 'confirmed' };
        }
      })
      .on('transactionHash', function (hash) {
        rooms[hash] = { price: price, owner: accounts[0] };
        return resolve(hash);
      })
      .on('error', (err) => reject(err));
  });
  return hashPromise;
};

const getRoom = () => async (id) => {
  console.log(id);
  return rooms[id];
};
const createIntentBook = ({ config }) => async (web3, day, month, year) => {
  const bookBnb = await getContract(web3, config.contractAddress);
  return bookBnb.intentBook(roomId, day, month, year, { value: toWei(1) }); // TODO Actual
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
  createRoom: createRoom(dependencies),
  createIntentBook: createIntentBook(dependencies),
  acceptBooking: acceptBooking(dependencies),
  rejectBooking: rejectBooking(dependencies),
  getRoom: getRoom(dependencies),
});
