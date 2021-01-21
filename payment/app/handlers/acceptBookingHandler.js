function schema(_config) {
  return {
    description: 'Confirms a pending booking for a Room',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
      },
    },
    body: {
      type: 'object',
      properties: {
        roomOwnerId: {
          type: 'integer',
        },
      },
    },
    required: ['id', 'roomOwnerId'],
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
    const acceptedBooking = await bookingController.acceptBooking(web3, req.params.id);
    reply.code(200).send(acceptedBooking);
  };
}

module.exports = { schema, handler };
