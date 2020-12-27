function schema(_config) {
  return {
    params: {
      type: 'object',
      properties: {
        ownerId: {
          type: 'integer',
        },
        price: {
          type: 'integer',
        },
      },
    },
    required: ['ownerId', 'price'],
  };
}

function handler({ roomController, walletController }) {
  return async function (req) {
    const wallet = await walletController.getWeb3WithWallet(req.body.ownerId);
    return roomController.createRoom(wallet, req.body.price, req.body.ownerId);
  };
}

module.exports = { schema, handler };
