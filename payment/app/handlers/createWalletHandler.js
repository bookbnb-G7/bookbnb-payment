function schema(_config) {
  return {
    params: {
      type: 'object',
      properties: {
        uuid: {
          type: 'integer',
        },
      },
    },
    required: ['uuid'],
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    const wallet = await walletController.createWallet(req.body.uuid);
    return reply.code(201).send(wallet);
  };
}

module.exports = { handler, schema };
