const { Room } = require('../models/room');
const { Wallet } = require('../models/wallet');
const { TransactionStatus } = require('../utils');
const { getContract, toWei } = require('../utils')

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
        if (process.env.ENVIRONMENT === 'testing' || r.events.RoomCreated) {
          if (process.env.ENVIRONMENT !== 'testing') {
            const { roomId } = r.events.RoomCreated.returnValues;
            id = roomId;
          }

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
      return Room.destroy({ where: {id: roomId} })
        .then((u) => { return room.toJSON() });
    } else {
      return {error: "not found"};
    }
  });
};

const roomExists = ({ config }) => async (roomId) =>{
  let room = await Room.findOne({ where: {id: roomId} });
  return room != null;
}

module.exports = ({ config }) => ({
  getRoom: getRoom,
  deleteRoom: deleteRoom,
  getAllRooms: getAllRooms,
  createRoom: createRoom({ config }),
  roomExists: roomExists({ config }),
});
