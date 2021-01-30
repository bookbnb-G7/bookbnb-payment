const { apiKeyIsNotValid, payloadIsCorrect } = require('../utils');

function schema(_config) {
  return {
    description: 'Creates a booking for a Room',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    body: {
      type: 'object',
      properties: {
        bookerId: {
          type: 'integer',
        },
        roomId: {
          type: 'integer',
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
    response: {
      201: {
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
    },
  };
}

async function findRequestErrors(req, bookingController, roomController, walletController) {
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check payload
  let attrsToCheck = {
    "bookerId": { "type": "number", "isInteger": true, "min": 0 },
    "roomId":  { "type": "number", "isInteger": true, "min": 0 },
    "dateFrom": { "type": "string", "isDate": true },
    "dateTo": { "type": "string", "isDate": true },
  }
  let err = payloadIsCorrect(req.body, attrsToCheck);
  if (err) {
    return { code: 400, error: error };
  }

  // Check wallet exists
  let walletExists = await walletController.walletExists(req.body.bookerId);
  if (!walletExists) {
    return { code: 404, error: "bookerId was not found" };
  }

  // Check room exists
  let roomExists = await roomController.roomExists(req.body.roomId);
  if (!roomExists) {
    return { code: 404, error: "roomId was not found" };
  }

  // Check room is not booked on that dates

  let dateFrom = req.body.dateFrom.split("-");
  dateFrom = dateFrom[2] + "-" + dateFrom[1] + "-" + dateFrom[0];
  let dateTo = req.body.dateTo.split("-");
  dateTo = dateTo[2] + "-" + dateTo[1] + "-" + dateTo[0];

  let bookingsOnSameDate = await bookingController.bookingsOnSameDate(req.body.roomId, dateFrom, dateTo)
  if (bookingsOnSameDate != 0)
    return { code: 400, error: "room is already booked on that date period "};

  return null;
}

function handler({ bookingController, roomController, walletController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, bookingController, roomController, walletController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const wallet = await walletController.getWeb3WithWallet(req.body.bookerId);

    let dateFromSplit = req.body.dateFrom.split("-");
    let dateToSplit = req.body.dateTo.split("-");

    // day month year

    const dateFrom = new Date(dateFromSplit[2], dateFromSplit[1] - 1, dateFromSplit[0]);
    const dateTo = new Date(dateToSplit[2], dateToSplit[1] - 1, dateToSplit[0]);

    let booking = await bookingController.createIntentBook(
      wallet, req.body.bookerId, req.body.roomId, dateFrom, dateTo
    );

    reply.code(201).send(booking);
  };
}

module.exports = { schema, handler };
