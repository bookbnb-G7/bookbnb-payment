function schema() {
  return {
    params: {
      type: 'object',
      properties: {
        roomId: {
          type: 'string',
        },
      },
    },
    required: ['roomId'],
  };
}

function handler({ roomController }) {
  return async function (req, reply) {
    const room = await roomController.getRoom(req.params.roomId);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
