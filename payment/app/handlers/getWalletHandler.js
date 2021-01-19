const { getBalance } = require('../utils')

function schema(_config) {
  return {
    description: 'Returns a wallet',
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
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    const wallet = await walletController.getWallet(req.params.uuid);

    if (wallet['error']) {
      reply.code(404).send(wallet);
      return;
    }

    reply.code(200).send(wallet);
  };
}

module.exports = { handler, schema };
