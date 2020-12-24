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

function handler({ identityService }) {
  return async function (req, reply) {
    const body = await identityService.getWallet(req.params.uuid);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
