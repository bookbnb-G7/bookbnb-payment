const getWallet = require('./handlers/getWalletHandler');
const getWallets = require('./handlers/getAllWalletsHandler');
const createWallet = require('./handlers/createWalletHandler');

const getRoom = require('./handlers/getRoomHandler');
const getRooms = require('./handlers/getAllRoomsHandler');
const createRoom = require('./handlers/createRoomHandler');
const deleteRoom = require('./handlers/deleteRoomHandler')

const getBooking = require('./handlers/getBookingHandler');
const rejectBooking = require('./handlers/rejectBookingHandler');
const acceptBooking = require('./handlers/acceptBookingHandler');
const deleteBooking = require('./handlers/deleteBookingHandler');
const getAllBookings = require('./handlers/getAllBookingsHandler');
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
    url: '/rooms/:roomId',
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

function deleteRoomRoute({ controllers, config }) {
  return {
    method: 'DELETE',
    url: '/rooms/:roomId',
    schema: deleteRoom.schema(config),
    handler: deleteRoom.handler({ config, ...controllers }),
  };
}

function getBookingRoute({ controllers, config }) {
  return {
    method: 'GET',
    url: '/bookings/:bookingId',
    schema: getBooking.schema(config),
    handler: getBooking.handler({ config, ...controllers }),
  };
}

function rejectBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/:bookingId/reject',
    schema: rejectBooking.schema(config),
    handler: rejectBooking.handler({ config, ...controllers }),
  };
}

function acceptBookRoute({ controllers, config }) {
  return {
    method: 'POST',
    url: '/bookings/:bookingId/accept',
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

function getBookings({ controllers, config }) {
  return {
    method: 'GET',
    url: '/bookings',
    schema: getAllBookings.schema(config),
    handler: getAllBookings.handler({ config, ...controllers }),
  };
}

function deleteBookingRoute({ controllers, config }) {
  return {
    method: 'DELETE',
    url: '/bookings/:bookingId',
    schema: deleteBooking.schema(config),
    handler: deleteBooking.handler({ config, ...controllers }),
  };
}

module.exports = [
  getWalletRoute,
  getAllWalletsRoute,
  createWalletRoute,
  createRoomRoute,
  getRoomRoute,
  deleteRoomRoute,
  getBookingRoute,
  getAllRoomsRoute,
  deleteBookingRoute,
  createIntentBookRoute,
  getBookings,
  acceptBookRoute,
  rejectBookRoute
];
