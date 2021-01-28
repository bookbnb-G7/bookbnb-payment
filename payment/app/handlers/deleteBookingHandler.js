const { apiKeyIsNotValid } = require('../utils');

function schema() {
  return {
    description: 'Returns a list of pending bookings of a room owner',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    params: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'integer'
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

async function findRequestErrors(req, bookingController) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check the booking exists
  let booking = await bookingController.getBooking(req.params.bookingId)
  if (booking["error"])
    return { code: 404, error: "booking was not found" };

  return null;
}

function handler({ bookingController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, bookingController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const booking = await bookingController.deleteBooking(req.params.bookingId);
    reply.code(200).send(booking);
  };
}

module.exports = { handler, schema };
