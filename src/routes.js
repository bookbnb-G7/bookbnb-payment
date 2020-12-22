const getIdentity = require('./handlers/getIdentityHandler');
const getIdentities = require('./handlers/getIdentitiesHandler');
const createIdentity = require('./handlers/createIdentityHandler');
const createRoom = require('./handlers/createRoomHandler');
const getRoom = require('./handlers/getRoomHandler');

function getIdentityRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/identity/:id',
    schema: getIdentity.schema(config),
    handler: getIdentity.handler({ config, ...services }),
  };
}

function getIdentitiesRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/identity',
    schema: getIdentities.schema(config),
    handler: getIdentities.handler({ config, ...services }),
  };
}

function postIdentityRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/identity',
    schema: createIdentity.schema(config),
    handler: createIdentity.handler({ config, ...services }),
  };
}

function createRoomRoute({ services, config }) {
  return {
    method: 'POST',
    url: '/room',
    schema: createRoom.schema(config),
    handler: createRoom.handler({ config, ...services }),
  };
}

function getRoomRoute({ services, config }) {
  return {
    method: 'GET',
    url: '/room/:id',
    schema: getRoom.schema(config),
    handler: getRoom.handler({ config, ...services }),
  };
}

module.exports = [
  postIdentityRoute,
  getIdentityRoute,
  getIdentitiesRoute,
  createRoomRoute,
  getRoomRoute,
];
