const { apiKeyIsNotValid, payloadIsCorrect } = require('../utils');

function schema(_config) {
  return {
    description: 'Creates a wallet',
    headers: {
      type: 'object',
      properties: { "api-key": { type: 'string' } }
    },
    body: {
      type: 'object',
      properties: {
        uuid: {
          type: 'integer',
        },
      },
    },
    required: ['uuid'],
    response: {
      201: {
        type: 'object',
        properties: {
          uuid: { type: 'integer' },
          address: { type: 'string' },
          mnemonic: { type: 'string' },
          balance: { type: 'number' },
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
      }
    }
  };
}

async function findRequestErrors(req, walletController) {
  // Check api-key
  if (apiKeyIsNotValid(req.headers['api-key'])) {
    return { code: 401, error: "unauthorized" };
  }

  // Check payload
  let attrsToCheck = {
    "uuid": { "type": "number", "isInteger": true, "min": 0 },
  }
  let error = payloadIsCorrect(req.body, attrsToCheck);
  if (error) {
    return { code: 400, error: error };
  }
  
  //  Check the uuid does not exist
  let walletExists = await walletController.walletExists(req.body.uuid);
  if (walletExists) {
    return { code: 400, error: "uuid is already in use" };
  }

  return null;
}


function handler({ walletController }) {
  return async function (req, reply) {

    // Check request errors
    let error = await findRequestErrors(req, walletController);
    if (error)
      return reply.code(error["code"]).send({ error: error["error"] });

    const wallet = await walletController.createWallet(req.body.uuid);
    walletJSON = wallet.toJSON();
    walletJSON['balance'] = 0.0;
    return reply.code(201).send(walletJSON);
  };
}

module.exports = { handler, schema };
