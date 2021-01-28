const config = require('./config');
const routes = require('./routes');
const { database } = require('./db');
const controllers = require('./controllers/controllers')({ config });

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

// Import Swagger Options
const swagger = require('./swagger')

// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options)

// Declares routes
routes.forEach((route) => fastify.route(route({ config, controllers })));


fastify.setErrorHandler((error, request, reply) => {
  // Send error response
  let err = { error: error['message'].split("\n")[0] };

  return reply.code(500).send(err);
})

// Run the server!
database.sync().then(async () => {
    try {
      await fastify.listen(process.env.PORT || 8080, '0.0.0.0');
      fastify.swagger();
      fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});

