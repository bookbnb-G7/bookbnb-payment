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

function handler({ roomController }) {
  return async function (req, reply) {
    const room = await roomController.deleteRoom(req.params.id);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
