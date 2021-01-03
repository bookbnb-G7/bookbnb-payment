function schema() {
  return {
    description: 'Returns a list of pending bookings of a room owner',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer'
        },
      },
    },
    required: ['id']
  };
}

function handler({ bookingController }) {
  return async function (req, reply) {
    const booking = await bookingController.deleteBooking(req.params.id);
    reply.code(200).send(booking);
  };
}

module.exports = { handler, schema };
