const { apiKeyIsNotValid } = require('../utils');

function schema(_config) {
  return {
    description: 'Creates a room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
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

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const wallet = await walletController.getWeb3WithWallet(req.body.ownerId);
    const room = await roomController.createRoom(wallet, req.body.price, req.body.ownerId);
    return reply.code(201).send(room);
  };
}

module.exports = { schema, handler };
