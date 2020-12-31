function schema() {
  return {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
    required: ['id'],
  };
}

function handler({ roomController }) {
  return async function (req, reply) {
    const room = await roomController.getRoom(req.params.id);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
