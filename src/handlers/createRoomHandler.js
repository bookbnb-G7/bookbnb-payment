function schema(config) {
  return {
    params: {
      type: 'object',
      properties: {
        creatorId: {
          type: 'integer',
        },
        price: {
          type: 'number',
        },
      },
    },
    required: ['creatorId', 'price'],
  };
}

function handler({ contractInteraction, identityService }) {
  return async function (req) {
    const identity = await identityService.getWeb3WithIdentity(req.body.creatorId);
    return contractInteraction.createRoom(identity, req.body.price);
  };
}

module.exports = { schema, handler };
