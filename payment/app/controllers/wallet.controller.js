const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Wallet } = require('../models/wallet');
const bip39 = require('bip39');
const Web3 = require("web3");

const MNEMONIC_GANACHE = 'clever draft disorder copper job link stand pluck excess various elegant august'

const createWallet = ({ config }) => async (uuid) => {
  let mnemonicPhrase = bip39.entropyToMnemonic(
    (Math.random() * 10000000000000000000).toString().split('.')[0].padStart(32, '0')
  );

  if (process.env.ENVIRONMENT === 'testing') {
    mnemonicPhrase = MNEMONIC_GANACHE
  }

  // creates new account if mnemonic does not exist
  // or retrieve if the accounts if mnemonic exists

  const eventProvider = new Web3.providers
    .WebsocketProvider(config.urlWebSocket);

  let provider = new HDWalletProvider({
    mnemonic: { phrase: mnemonicPhrase },
    providerOrUrl: config.urlNode,
    eventProvider: eventProvider
  });

  console.log('provider: ',provider);

  const web3 = new Web3(provider);
  const currentAccounts = await web3.eth.getAccounts();

  return await Wallet.create({
    uuid: uuid,
    mnemonic: mnemonicPhrase,
    address: currentAccounts[0]
  });
};

const getAllWallets = async () => {
  await Wallet.findAll({raw: true});
}

const getWallet = async (uuid) => {
  let wallet = await Wallet.findOne({ where: {uuid: uuid} });
  if (!wallet) return {error: "not found"};
  return wallet;
};

const getWalletWithWeb3 = ({ config }) => async (uuid) => {
  let wallet = await Wallet.findOne({ where: {uuid: uuid} });

  const eventProvider = new Web3.providers
    .WebsocketProvider(config.urlWebSocket);

  const provider = new HDWalletProvider({
    mnemonic: { phrase: wallet['dataValues'].mnemonic },
    providerOrUrl: config.urlNode,
    eventProvider: eventProvider
  });

  return new Web3(provider);
};

module.exports = ({ config }) => ({
  getWallet,
  getAllWallets,
  createWallet: createWallet({config}),
  getWeb3WithWallet: getWalletWithWeb3({config}),
});
