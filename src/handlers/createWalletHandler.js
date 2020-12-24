function schema(config) {
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

function handler({ identityService }) {
  return async function (req, reply) {
    const body = await identityService.createWallet(req.body.uuid);
    return reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
