function schema(_config) {
  return {
    description: 'Creates a room',
    body: {
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
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          price: { type: 'integer' },
          ownerId: { type: 'integer' },
          transactionStatus: { type: 'integer' },
          transactionHash: { type: 'string' },
        }
      }
    }
  };
}

function handler({ roomController, walletController }) {
  return async function (req, reply) {
    const wallet = await walletController.getWeb3WithWallet(req.body.ownerId);
    const room = await roomController.createRoom(wallet, req.body.price, req.body.ownerId);
    return reply.code(201).send(room);
  };
}

module.exports = { schema, handler };
