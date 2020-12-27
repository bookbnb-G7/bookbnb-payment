const getWallet = require('./handlers/getWalletHandler');
const getWallets = require('./handlers/getAllWalletsHandler');
const createWallet = require('./handlers/createWalletHandler');

const getRoom = require('./handlers/getRoomHandler');
const createRoom = require('./handlers/createRoomHandler');

const rejectBooking = require('./handlers/rejectBookingHandler');
const acceptBooking = require('./handlers/acceptBookingHandler');
const createIntentBook = require('./handlers/createIntentBookHandler');

function getWalletRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/wallets/:uuid',
    schema: getWallet.schema(config),
    handler: getWallet.handler({ config, ...controllers }),
  };
}

function getAllWalletsRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/wallets',
    schema: getWallets.schema(config),
    handler: getWallets.handler({ config, ...controllers }),
  };
}

function createWalletRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/wallets',
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...controllers }),
  };
}


function createRoomRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/rooms',
    schema: createRoom.schema(config),
    handler: createRoom.handler({ config, ...controllers }),
  };
}

function getRoomRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/rooms/:id',
    schema: getRoom.schema(config),
    handler: getRoom.handler({ config, ...controllers }),
  };
}



function rejectBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/reject/:id',
    schema: rejectBooking.schema(config),
    handler: rejectBooking.handler({ config, ...controllers }),
  };
}

function acceptBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/accept/:id',
    schema: acceptBooking.schema(config),
    handler: acceptBooking.handler({ config, ...controllers }),
  };
}

function createIntentBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings',
    schema: createIntentBook.schema(config),
    handler: createIntentBook.handler({ config, ...controllers }),
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
