const { apiKeyIsNotValid } = require('../utils');

function schema() {
  return {
    description: 'Returns a list of pending bookings of a room owner',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    querystring: {
      type: 'object',
      properties: {
        bookerId: {
          type: 'integer'
        },
        roomOwnerId: {
          type: 'integer',
        },
        roomId: {
          type: 'integer',
        },
        bookingStatus:  {
          type: 'integer'
        },
      },
    },
    response: {
      200: {
        type: 'array',
        items: {
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
    }
  };
}

function handler({ bookingController }) {
  return async function (req, reply) {

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const bookings = await bookingController.getBookings(req.query);
    reply.code(200).send(bookings);
  };
}

module.exports = { handler, schema };
