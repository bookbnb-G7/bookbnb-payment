const { apiKeyIsNotValid } = require('../utils');

function schema() {
  return {
    description: 'Returns a list of pending bookings of a room owner',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
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

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const room = await roomController.deleteRoom(req.params.id);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
