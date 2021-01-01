function schema(_config) {
  return {
    params: {},
  };
}

function handler({ roomController }) {
  return async function (req, reply) {
    const rooms = await roomController.getAllRooms();
    return reply.code(200).send(rooms);
  };
}

module.exports = { handler, schema };
