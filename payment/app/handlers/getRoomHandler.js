const { apiKeyIsNotValid } = require('../utils');

function schema() {
  return {
    description: 'Returns a room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
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

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const room = await roomController.getRoom(req.params.id);
    if (room.error) {
      reply.code(404).send(room);
      return;
    }
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
