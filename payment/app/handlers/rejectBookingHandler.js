function schema(_config) {
  return {
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
