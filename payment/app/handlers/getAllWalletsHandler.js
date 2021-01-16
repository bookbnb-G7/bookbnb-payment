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
            balance: { type: 'number' },
          }
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    // Obtains a raw list of JSON objects
    let wallets = await walletController.getAllWallets();
    for (wallet in wallets) {
      wallets[wallet]['balance'] = 0.0;
    }
    return reply.code(200).send(wallets);
  };
}

module.exports = { handler, schema };
