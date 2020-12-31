const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../ultis');
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

const _getWallet = async (uuid) => {
  return Wallet.findOne({ where: {uuid: uuid} }).then((wallet) => {
    if (wallet) {
      return wallet.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};

const createRoom = ({ config }) => async (web3, price, ownerId) => {
  const ownerWallet = await _getWallet(ownerId)

  const bookbnbContract = await getContract(web3, config.contractAddress);

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].createRoom(toWei(price))
      .send({ from: ownerWallet.address })
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

          console.log("ROOM BOOKING RETURN VALUES");
          console.log(r.events.RoomCreated.returnValues);

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

const getAllRooms = async () => {
  return Room.findAll({raw: true}).then((rooms) => {
    return rooms;
  });
}

module.exports = ({ config }) => ({
  getRoom: getRoom,
  getAllRooms: getAllRooms,
  createRoom: createRoom({ config })
});
