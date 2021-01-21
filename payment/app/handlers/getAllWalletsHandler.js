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
          }
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {

    if (apiKeyIsNotValid(req.headers['api-key'])) {
      return reply.code(401).send({ error: "unauthorized" });
    }

    // Obtains a raw list of JSON objects
    let wallets = await walletController.getAllWallets();
    return reply.code(200).send(wallets);
  };
}

module.exports = { handler, schema };
