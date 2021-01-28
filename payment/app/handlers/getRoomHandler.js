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
        roomId: {
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
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      }
    }
  };
}

async function findRequestErrors(req) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }
    
  return null;
}

function handler({ roomController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const room = await roomController.getRoom(req.params.roomId);
    if (room.error) {
      reply.code(404).send(room);
      return;
    }
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
