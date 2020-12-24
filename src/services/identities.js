const HDWalletProvider = require('truffle-hdwallet-provider');
const bip39 = require('bip39');
const Web3 = require('web3');

const accounts = [];

// initially, Web3 constructor has this
// Web3(provider, null, { transactionConfirmationBlocks: 1 })

const createWallet = ({ config }) => async (uuid) => {
  const mnemonic = bip39.entropyToMnemonic(
    (Math.random() * 10000000000000000000).toString().split('.')[0].padStart(32, '0')
  );

  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  const web3 = new Web3(provider);
  const currentAccounts = await web3.eth.getAccounts();

  accounts.push({
    address: currentAccounts[0],
    mnemonic,
    uuid,
  });

  return {
    id: accounts.length, // wallet id
    uuid: uuid, // user id (owner of the wallet)
    mnemonic,
    address: currentAccounts[0]
  };
};

const getAllWallets = () => () => {
  return accounts;
};

const getWallet = () => (uuid) => {
  //return accounts.findOne({ where: {uuid: uuid} });
  return accounts.find(x => x.uuid === uuid);
};

const getWeb3WithWallet = ({ config }) => (uuid) => {
  const mnemonic = getWallet({ config })(uuid).mnemonic;
  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  return new Web3(provider);
};

module.exports = ({ config }) => ({
  getWallet: getWallet({ config }),
  createWallet: createWallet({ config }),
  getAllWallets: getAllWallets({ config }),
  getWeb3WithWallet: getWeb3WithWallet({ config }),
});
