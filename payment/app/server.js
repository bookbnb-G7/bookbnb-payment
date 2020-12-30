const config = require('./config');
const routes = require('./routes');
const { database } = require('./db');
const controllers = require('./controllers/controllers')({ config });

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

// Declares routes
routes.forEach((route) => fastify.route(route({ config, controllers })));

// Run the server!
database.sync().then(async () => {
    try {
      await fastify.listen(process.env.PORT || 8080, '0.0.0.0');
      fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});

postgres://cufxxezgcvqndq:d98bab48c7933692defa68c206333ecf6095c1ef77f3980b49e20fce14cbc2c3@ec2-54-175-243-75.compute-1.amazonaws.com:5432/d1bkhdnhcuou14