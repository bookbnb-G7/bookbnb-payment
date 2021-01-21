const { apiKeyIsNotValid } = require('../utils');

function schema(_config) {
  return {
    description: 'Creates a booking for a Room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    body: {
      type: 'object',
      properties: {
        bookerId: {
          type: 'integer',
        },
        roomId: {
          type: 'integer',
        },
        dateFrom: {
          type: 'string'
        },
        dateTo: {
          type: 'string'
        }
      },
    },
    required: ['bookerId', 'roomId', 'dateFrom', 'dateTo'],
    response: {
      201: {
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
    },
  };
}

function handler({ bookingController, walletController }) {
  return async function (req, reply) {

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const wallet = await walletController.getWeb3WithWallet(req.body.bookerId);

    let dateFromSplit = req.body.dateFrom.split("-");
    let dateToSplit = req.body.dateTo.split("-");

    // day month year

    const dateFrom = new Date(dateFromSplit[2], dateFromSplit[1] - 1, dateFromSplit[0]);
    const dateTo = new Date(dateToSplit[2], dateToSplit[1] - 1, dateToSplit[0]);

    let booking = await bookingController.createIntentBook(
      wallet, req.body.bookerId, req.body.roomId, dateFrom, dateTo
    );

    reply.code(201).send(booking);
  };
}

module.exports = { schema, handler };
