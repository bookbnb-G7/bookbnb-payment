const { apiKeyIsNotValid } = require('../utils');

function schema(_config) {
  return {
    description: 'Returns all rooms',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
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
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      },
      401: {
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

    const rooms = await roomController.getAllRooms();
    return reply.code(200).send(rooms);
  };
}

module.exports = { handler, schema };
