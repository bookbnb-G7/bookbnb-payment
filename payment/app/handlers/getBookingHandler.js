function schema() {
  return {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
      },
    },
    required: ['id'],
  };
}

function handler({ bookingController }) {
  return async function (req, reply) {
    const booking = await bookingController.getBooking(req.params.id);
    reply.code(200).send(booking);
  };
}

module.exports = { handler, schema };
