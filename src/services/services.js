const identityService = require('./identities');
const contractInteraction = require('./contractInteraction');

module.exports = ({ config }) => ({
  identityService: identityService({ config }),
  contractInteraction: contractInteraction({ config }),
});
