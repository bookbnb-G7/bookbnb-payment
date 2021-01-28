const { apiKeyIsNotValid, payloadIsCorrect } = require('../utils');

function schema(_config) {
  return {
    description: 'Confirms a pending booking for a Room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    params: {
      type: 'object',
      properties: {
        bookingId: {
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
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        }
      }
    }
  };
}

async function findRequestErrors(req, walletController, bookingController) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check payload
  let attrsToCheck = {
    "roomOwnerId": { "type": "number", "isInteger": true, "min": 0 },
  }
  let error = payloadIsCorrect(req.body, attrsToCheck);
  if (error) {
    return { code: 400, error: error };
  }

  // Check the owner_id exists
  let walletExists = await walletController.walletExists(req.body.roomOwnerId);
  if (!walletExists) {
    return { code: 404, error: "roomOwnerId was not found" };
  }

  // Check the booking exists
  let booking = await bookingController.getBooking(req.params.bookingId)
  if (booking["error"])
    return { code: 404, error: "booking was not found" };
  
  // check if status is pending
  if (booking["bookingStatus"] != 1)
    return { code: 400, error: "booking status is not pending" }

  return null;
}

function handler({ bookingController, walletController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, walletController, bookingController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const web3 = await walletController.getWeb3WithWallet(req.body.roomOwnerId);
    const acceptedBooking = await bookingController.acceptBooking(web3, req.params.bookingId);
    reply.code(200).send(acceptedBooking);
  };
}

module.exports = { schema, handler };
