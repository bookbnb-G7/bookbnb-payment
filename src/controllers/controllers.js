const roomController = require('./room.controller');
const walletController = require('./wallet.controller');
const bookingController = require('./booking.controller');

module.exports = ({ config }) => ({
  roomController: roomController({ config }),
  walletController: walletController({ config }),
  bookingController: bookingController({ config }),
});
