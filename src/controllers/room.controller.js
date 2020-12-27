const { Room } = require('../models/room');
const { getContract, toWei } = require('../ultis')


const createRoom = ({ config }) => async (web3, price, ownerId) => {
  const wallets = await web3.eth.getAccounts();
  const ownerWallet = wallets[0]

  const bookbnbContract = await getContract(web3, config.contractAddress);

  return new Promise((resolve, reject) => {
    bookbnbContract.methods.createRoom(toWei(price))
      .send({ from: ownerWallet })
      .on('receipt', (r) => {
        if (r.events.RoomCreated) {
          const { roomId } = r.events.RoomCreated.returnValues;
          Room.create({
            id: roomId,
            price: price,
            ownerId: ownerId,
            transactionHash: r.transactionHash,
          }).then((newRoom) => {
            return resolve(newRoom.toJSON());
          })
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
