function schema(_config) {
  return {
    description: 'Creates a wallet',
    body: {
      type: 'object',
      properties: {
        uuid: {
          type: 'integer',
        },
      },
    },
    required: ['uuid'],
    response: {
      201: {
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
    const wallet = await walletController.createWallet(req.body.uuid);
    walletJSON = wallet.toJSON();
    walletJSON['balance'] = 0.0;
    return reply.code(201).send(walletJSON);
  };
}

module.exports = { handler, schema };
