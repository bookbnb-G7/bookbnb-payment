const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../utils');
const { getContract, toWei } = require('../utils')

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

  let id = 0;
  if (process.env.ENVIRONMENT === "testing") {
    id = (await Room.findAll({raw: true})).length;
  }

  return new Promise((resolve, reject) => {
    bookbnbContract['methods'].createRoom(toWei(price))
      .send({ from: ownerWallet.address })
      .on('receipt', (r) => {
        console.log(r);

        if (process.env.ENVIRONMENT === 'testing' || r.events.RoomCreated) {
          if (process.env.ENVIRONMENT !== 'testing') {
            const { roomId } = r.events.RoomCreated.returnValues;
            id = roomId;
          }

          console.log('ID: ', id);

          Room.create({
            id: id,
            price: price,
            ownerId: ownerId,
            transactionHash: r.transactionHash,
            transactionStatus: TransactionStatus.confirmed,
          }).then((newRoom) => {
            return resolve(newRoom.toJSON());
          }).catch((error) => {
            return reject(error);
          });
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

const deleteRoom = async (roomId) => {
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
  deleteRoom: deleteRoom,
  getAllRooms: getAllRooms,
  createRoom: createRoom({ config })
});
