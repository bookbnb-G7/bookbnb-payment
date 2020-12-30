function schema(_config) {
  return {
    params: {},
  };
}

function handler({ walletController }) {
  return async function (req, reply) {
    const wallets = await walletController.getAllWallets();
    return reply.code(200).send(wallets);
  };
}

module.exports = { handler, schema };
