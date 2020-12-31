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
        dateFrom: {
          type: 'string'
        },
        dateTo: {
          type: 'string'
        }
      },
    },
    required: ['bookerId', 'roomId', 'dateFrom', 'dateTo'],
  };
}

function handler({ bookingController, walletController }) {
  return async function (req) {
    const wallet = await walletController.getWeb3WithWallet(req.body.bookerId);

    const dateFrom = new Date(req.body.dateFrom);
    const dateTo = new Date(req.body.dateTo);

    return bookingController.createIntentBook(
      wallet, req.body.bookerId, req.body.roomId, dateFrom, dateTo
    );
  };
}

module.exports = { schema, handler };
