function schema(_config) {
  return {
    description: 'Returns all the wallets',
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
          }
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    const wallets = await walletController.getAllWallets();
    return reply.code(200).send(wallets);
  };
}

module.exports = { handler, schema };
