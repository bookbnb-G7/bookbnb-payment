function schema() {
  return {
    description: 'Returns a booking for a Room',
    params: {
      type: 'object',
      properties: {
        id: {
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
        }
      }
    }
  };
}

function handler({ bookingController }) {
  return async function (req, reply) {
    const booking = await bookingController.getBooking(req.params.id);
    if (booking.error) {
      reply.code(404).send(booking);
      return;
    }
    reply.code(200).send(booking);
  };
}

module.exports = { handler, schema };
