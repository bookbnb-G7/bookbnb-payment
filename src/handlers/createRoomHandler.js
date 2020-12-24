function schema(_config) {
  return {
    params: {
      type: 'object',
      properties: {
        ownerId: {
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
    const wallet = await identityService.getWeb3WithWallet(req.body.ownerId);
    return contractInteraction.createRoom(wallet, req.body.price, req.body.ownerId);
  };
}

module.exports = { schema, handler };
