const config = require('./config');
const routes = require('./routes');
const services = require('./services/services')({ config });

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

// Declares routes
routes.forEach((route) => fastify.route(route({ config, services })));

const port = process.env.PORT || 8080;

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
