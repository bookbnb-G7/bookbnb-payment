function schema(_config) {
  return {
    description: 'Rejects a pending booking for a Room',
    params: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'integer',
        },
        roomOwnerId: {
          type: 'integer',
        },
      },
    },
    required: ['bookingId', 'roomOwnerId'],
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          price: { type: 'integer' },
          roomId: { type: 'integer' },
          bookerId: { type: 'integer' },
          roomOwnerId: { type: 'integer' },
          dateFrom: { type: 'string', format: 'date' },
          dateTo: { type: 'string', format: 'date' },
          bookingStatus: { type: 'integer' },
          transactionStatus: { type: 'integer' },
          transactionHash: { type: 'string' },
        }
      }
    }
  };
}

function handler({ bookingController, walletController }) {
  return async function (req, reply) {
    const web3 = await walletController.getWeb3WithWallet(req.body.roomOwnerId);
    const rejectedBooking = await bookingController.rejectBooking(web3, req.params.id);
    reply.code(201).send(rejectedBooking);
  };
}

module.exports = { schema, handler };
