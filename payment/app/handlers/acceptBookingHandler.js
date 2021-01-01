function schema(_config) {
  return {
    params: {
      type: 'object',
      properties: {
        roomOwnerId: {
          type: 'integer',
        },
        id: {
          type: 'integer',
        },
      },
    },
    required: ['id', 'roomOwnerId'],
  };
}

function handler({ bookingController, walletController }) {
  return async function (req, reply) {
    const web3 = await walletController.getWeb3WithWallet(req.body.roomOwnerId);
    const acceptedBooking = await bookingController.acceptBooking(web3, req.params.id);
    reply.code(201).send(acceptedBooking);
  };
}

module.exports = { schema, handler };
