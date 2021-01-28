const { apiKeyIsNotValid, payloadIsCorrect } = require('../utils');

function schema(_config) {
  return {
    description: 'Creates a room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    body: {
      type: 'object',
      properties: {
        ownerId: {
          type: 'integer',
        },
        price: {
          type: 'integer',
        },
      },
    },
    required: ['ownerId', 'price'],
    response: {
      201: {
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
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' },
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

async function findRequestErrors(req, walletController) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check payload
  let attrsToCheck = {
    "ownerId": { "type": "number", "isInteger": true, "min": 0 },
    "price":  { "type": "number", "isInteger": true, "min": 1 },
  }
  let error = payloadIsCorrect(req.body, attrsToCheck);
  if (error) {
    return { code: 400, error: error };
  }

  //  Check the owner_id exists
  let walletExists = await walletController.walletExists(req.body.ownerId);
  if (!walletExists) {
    return { code: 404, error: "ownerId was not found" };
  }

  return null;
}

function handler({ roomController, walletController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, walletController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const wallet = await walletController.getWeb3WithWallet(req.body.ownerId);
    const room = await roomController.createRoom(wallet, req.body.price, req.body.ownerId);
    return reply.code(201).send(room);
  };
}

module.exports = { schema, handler };
