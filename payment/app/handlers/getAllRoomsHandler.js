function schema(_config) {
  return {
    description: 'Returns all rooms',
    params: {},
    response: {
      200: { 
        type: 'array',
        items: {
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
    }
  };
}

function handler({ roomController }) {
  return async function (req, reply) {
    const rooms = await roomController.getAllRooms();
    return reply.code(200).send(rooms);
  };
}

module.exports = { handler, schema };
