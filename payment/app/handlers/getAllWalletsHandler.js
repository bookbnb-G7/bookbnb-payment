const { apiKeyIsNotValid } = require('../utils');

function schema(_config) {
  return {
    description: 'Returns all the wallets',
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
            uuid: { type: 'integer' },
            address: { type: 'string' },
            mnemonic: { type: 'string' },
            balance: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      }
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
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

function handler({ walletController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    // Obtains a raw list of JSON objects
    let wallets = await walletController.getAllWallets();
    return reply.code(200).send(wallets);
  };
}

module.exports = { handler, schema };
