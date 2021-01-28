const { apiKeyIsNotValid } = require('../utils');

function schema() {
  return {
    description: 'Returns a booking for a Room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    params: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'integer',
        },
      },
    },
    required: ['id'],
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
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      },
      404: {
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
    let error = await findRequestErrors(req);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const booking = await bookingController.getBooking(req.params.bookingId);
    if (booking.error) {
      reply.code(404).send(booking);
      return;
    }
    reply.code(200).send(booking);
  };
}

module.exports = { handler, schema };
