function schema(_config) {
  return {
    description: 'Returns "payment" message',
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        }
      }
    }
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    reply.code(200).send({ message: "payment" });
  };
}

module.exports = { handler, schema };