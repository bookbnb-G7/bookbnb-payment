function schema(_config) {
  return {
    description: 'Creates a wallet',
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
      201: {
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
    const wallet = await walletController.createWallet(req.body.uuid);
    return reply.code(201).send(wallet);
  };
}

module.exports = { handler, schema };
