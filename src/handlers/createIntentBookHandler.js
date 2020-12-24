function schema(_config) {
  return {
    params: {
      type: 'object',
      properties: {
        bookerId: {
          type: 'integer',
        },
        roomId: {
          type: 'number',
        },
        days: {
          type: 'integer'
        },
        dateStart: {
          type: 'string'
        }
      },
    },
    required: ['bookerId', 'roomId', 'days', 'dateStart'],
  };
}

function handler({ contractInteraction, identityService }) {
  return async function (req) {
    const wallet = await identityService.getWeb3WithWallet(req.body.ownerId);

    return contractInteraction.createIntentBook(
      wallet, req.body.bookerId, req.body.roomId, req.body.days, req.body.dateStart
    );
  };
}

module.exports = { schema, handler };
