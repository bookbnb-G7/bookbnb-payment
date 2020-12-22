function schema(config) {
  return {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
      },
    },
    required: ['id'],
  };
}

function handler({ identityService }) {
  return async function (req, reply) {
    const body = await identityService.getIdentity(req.params.id);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
