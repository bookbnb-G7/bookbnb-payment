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
        roomId: {
          type: 'integer'
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

async function findRequestErrors(req, roomController) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check room exists
  let roomExists = await roomController.roomExists(req.params.roomId);
  if (!roomExists) {
    return { code: 404, error: "roomId was not found" };
  }
    
  return null;
}

function handler({ roomController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, roomController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const room = await roomController.deleteRoom(req.params.roomId);
    reply.code(200).send(room);
  };
}

module.exports = { handler, schema };
