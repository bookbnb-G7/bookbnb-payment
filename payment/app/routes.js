const getWallet = require('./handlers/getWalletHandler');
const getWallets = require('./handlers/getAllWalletsHandler');
const createWallet = require('./handlers/createWalletHandler');

const getRoom = require('./handlers/getRoomHandler');
const getRooms = require('./handlers/getAllRoomsHandler');
const createRoom = require('./handlers/createRoomHandler');

const getBooking = require('./handlers/getBookingHandler');
const rejectBooking = require('./handlers/rejectBookingHandler');
const acceptBooking = require('./handlers/acceptBookingHandler');
const createIntentBook = require('./handlers/createIntentBookHandler');
const getPendingBookings = require('./handlers/getPendingBookingsHandler');

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

function getAllRoomsRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/rooms',
    schema: getRooms.schema(config),
    handler: getRooms.handler({ config, ...controllers }),
  };
}

function getBookingRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/bookings/:id',
    schema: getBooking.schema(config),
    handler: getBooking.handler({ config, ...controllers }),
  };
}

function rejectBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/:id/reject',
    schema: rejectBooking.schema(config),
    handler: rejectBooking.handler({ config, ...controllers }),
  };
}

function acceptBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/:id/accept',
    schema: acceptBooking.schema(config),
    handler: acceptBooking.handler({ config, ...controllers }),
  };
}

function getPendingBookingsRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/bookings/pending/:roomOwnerId',
    schema: getPendingBookings.schema(config),
    handler: getPendingBookings.handler({ config, ...controllers }),
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
  getBookingRoute,
  getAllRoomsRoute,
  createIntentBookRoute,
  getPendingBookingsRoute,
  acceptBookRoute,
  rejectBookRoute
];
