const Web3 = require('web3');
const bip39 = require('bip39');
const HDWalletProvider = require('truffle-hdwallet-provider');
const accounts = [];

const createIdentity = ({ config }) => async () => {
  const mnemonic = bip39.entropyToMnemonic(
    (Math.random() * 10000000000000000000).toString().split('.')[0].padStart(32, '0')
  );
  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  const currentAccounts = await web3.eth.getAccounts();
  accounts.push({
    address: currentAccounts[0],
    mnemonic,
  });
  return { id: accounts.length, address: currentAccounts[0], mnemonic };
};

const getIdentities = () => () => {
  return accounts;
};

const getIdentity = () => (index) => {
  return accounts[index - 1];
};

const getWeb3WithIdentity = ({ config }) => (index) => {
  const mnemonic = getIdentity({ config })(index).mnemonic;
  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  return web3;
};

module.exports = ({ config }) => ({
  createIdentity: createIdentity({ config }),
  getIdentity: getIdentity({ config }),
  getIdentities: getIdentities({ config }),
  getWeb3WithIdentity: getWeb3WithIdentity({ config }),
});
