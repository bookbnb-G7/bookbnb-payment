const { getBalance, apiKeyIsNotValid } = require('../utils')

function schema(_config) {
  return {
    description: 'Returns a wallet',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    params: {
      type: 'object',
      properties: {
        uuid: {
          type: 'integer',
        },
      },
    },
    required: ['uuid'],
    response: {
      200: {
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
    
    const wallet = await walletController.getWallet(req.params.uuid);

    if (wallet['error']) {
      reply.code(404).send(wallet);
      return;
    }

    reply.code(200).send(wallet);
  };
}

module.exports = { handler, schema };
