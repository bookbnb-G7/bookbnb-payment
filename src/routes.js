const getWallet = require('./handlers/getWalletHandler');
const getWallets = require('./handlers/getAllWalletsHandler');
const createWallet = require('./handlers/createWalletHandler');

const getRoom = require('./handlers/getRoomHandler');
const createRoom = require('./handlers/createRoomHandler');

const rejectBook = require('./handlers/rejectBookHandler');
const acceptBook = require('./handlers/acceptBookHandler');
const createIntentBook = require('./handlers/createIntentBookHandler');


function getWalletRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/wallets/:uuid',
    schema: getWallet.schema(config),
    handler: getWallet.handler({ config, ...services }),
  };
}

function getAllWalletsRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/wallets',
    schema: getWallets.schema(config),
    handler: getWallets.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/wallets',
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}


function createRoomRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/rooms',
    schema: createRoom.schema(config),
    handler: createRoom.handler({ config, ...services }),
  };
}

function getRoomRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/rooms/:id',
    schema: getRoom.schema(config),
    handler: getRoom.handler({ config, ...services }),
  };
}


function rejectBookRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/books/:id',
    schema: rejectBook.schema(config),
    handler: rejectBook.handler({ config, ...services }),
  };
}

function acceptBookRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/books/:id',
    schema: acceptBook.schema(config),
    handler: acceptBook.handler({ config, ...services }),
  };
}

function createIntentBookRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/books',
    schema: createIntentBook.schema(config),
    handler: createIntentBook.handler({ config, ...services }),
  };
}

module.exports = [
  getWalletRoute,
  getAllWalletsRoute,
  createWalletRoute,
  createRoomRoute,
  getRoomRoute,
  createIntentBookRoute,
  acceptBookRoute,
  rejectBookRoute
];
