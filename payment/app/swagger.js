exports.options = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Payment server API',
      description: 'Information of the API to use bookbnb smart contract'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
