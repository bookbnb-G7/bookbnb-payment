const { apiKeyIsNotValid } = require('../utils');

function schema(_config) {
  return {
    description: 'Rejects a pending booking for a Room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
      },
    },
    body: {
      type: 'object',
      properties: {
        roomOwnerId: {
          type: 'integer',
        },
      },
    },
    required: ['id', 'roomOwnerId'],
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          price: { type: 'integer' },
          roomId: { type: 'integer' },
          bookerId: { type: 'integer' },
          roomOwnerId: { type: 'integer' },
          dateFrom: { type: 'string', format: 'date' },
          dateTo: { type: 'string', format: 'date' },
          bookingStatus: { type: 'integer' },
          transactionStatus: { type: 'integer' },
          transactionHash: { type: 'string' },
        }
      }
    }
  };
}

function handler({ bookingController, walletController }) {
  return async function (req, reply) {

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const web3 = await walletController.getWeb3WithWallet(req.body.roomOwnerId);
    const rejectedBooking = await bookingController.rejectBooking(web3, req.params.id);
    reply.code(200).send(rejectedBooking);
  };
}

module.exports = { schema, handler };
