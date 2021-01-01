function schema() {
  return {
    params: {
      type: 'object',
      properties: {
        roomOwnerId: {
          type: 'integer',
        },
      },
    },
    required: ['roomOwnerId'],
  };
}

function handler({ bookingController }) {
  return async function (req, reply) {
    const pendingBookings =
      await bookingController.getPendingBookings(req.params.roomOwnerId);
    reply.code(200).send(pendingBookings);
  };
}

module.exports = { handler, schema };
