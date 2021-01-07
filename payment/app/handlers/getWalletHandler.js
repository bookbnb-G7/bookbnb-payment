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
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    const wallet = await walletController.getWallet(req.params.uuid);
    reply.code(200).send(wallet);
  };
}

module.exports = { handler, schema };
