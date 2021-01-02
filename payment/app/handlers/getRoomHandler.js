function schema() {
  return {
    description: 'Returns a room',
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
          ownerId: { type: 'integer' },
          transactionStatus: { type: 'integer' },
          transactionHash: { type: 'string' },
        }
      }
    }
  };
}

function handler({ roomController }) {
  return async function (req, reply) {
    const room = await roomController.getRoom(req.params.id);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
