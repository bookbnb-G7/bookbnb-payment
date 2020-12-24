function schema(config) {
  return {
    params: {},
  };
}

function handler({ identityService }) {
  return async function (req, reply) {
    const body = await identityService.getAllWallets();
    return reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
