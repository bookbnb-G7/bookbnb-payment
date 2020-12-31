const { TransactionStatus } = require('../ultis');
const { Room } = require('../models/room');
const { getContract, toWei } = require('../ultis')

const _changeTransactionStatus = async (transactionHash, newStatus) => {
  Room.findOne({where: {transactionHash: transactionHash}}).then((room) => {
    if (room) {
      room.update({transactionStatus: newStatus}).then(() => {
        return true;
      });
    }
  });
};

const createRoom = ({ config }) => async (web3, price, ownerId) => {
  const wallets = await web3.eth.getAccounts();
  const ownerWallet = wallets[0]

  const bookbnbContract = await getContract(web3, config.contractAddress);

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].createRoom(toWei(price))
      .send({ from: ownerWallet })
      .on('transactionHash', (hash) => {
        Room.create({
          price: price,
          ownerId: ownerId,
          transactionHash: hash,
          transactionStatus: TransactionStatus.pending,
        }).then((newRoom) => {
          return resolve(newRoom.toJSON());
        });
      })
      .on('receipt', (r) => {
        console.log('receipt: ', r);
        if (r.events.RoomCreated) {
          _changeTransactionStatus(
            r.transactionHash, TransactionStatus.confirmed
          );
        }
      })
      .on('error', (err) => reject(err));
  });
};

const getRoom = async (roomId) => {
  return Room.findOne({ where: {id: roomId} }).then((room) => {
    if (room) {
      return room.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};

module.exports = ({ config }) => ({
  getRoom: getRoom,
  createRoom: createRoom({ config })
});
