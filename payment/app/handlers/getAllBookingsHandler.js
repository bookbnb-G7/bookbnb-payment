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
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      }
    }
  };
}

async function findRequestErrors(req) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  return null;
}

function handler({ bookingController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, bookingController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const bookings = await bookingController.getBookings(req.query);
    reply.code(200).send(bookings);
  };
}

module.exports = { handler, schema };
