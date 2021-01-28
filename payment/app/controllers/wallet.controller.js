const HDWalletProvider = require("@truffle/hdwallet-provider");
const { getBalance } = require('../utils');
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
  let address = currentAccounts[0];

  // if testing, we return one of the accounts
  // provided by ganache instead of creating a
  // new one
  if (process.env.ENVIRONMENT === 'testing') {
    address = currentAccounts[uuid - 1];
  }

  return await Wallet.create({
    uuid: uuid,
    address: address,
    mnemonic: mnemonicPhrase
  });
};

const getAllWallets = ({ config }) => async () => {
  let wallets = await Wallet.findAll({raw: true});

  const web3 = _getRawWeb3(config)

  for (let i = 0; i < wallets.length; i++) {
    let address = wallets[i].address;
    wallets[i]['balance'] = await getBalance(web3, address);
  }

  return wallets;
}

const getWallet = ({ config }) => async (uuid) => {
  let wallet = await Wallet.findOne({ where: {uuid: uuid} });
  if (!wallet) return {error: "not found"};


  const web3 = _getRawWeb3(config);
  const address = wallet['dataValues'].address;

  let walletJson = wallet.toJSON();
  walletJson['balance'] = await getBalance(web3, address);
  return walletJson;
};

const getWeb3WithWallet = ({ config }) => async (uuid) => {
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

const _getRawWeb3 = (config) => {
  const provider = new Web3.providers.HttpProvider(config.urlNode);
  return new Web3(provider);
}

const walletExists = ({ config }) => async (uuid) =>{
  let wallet = await Wallet.findOne({ where: {uuid: uuid} });
  return wallet != null;
}

module.exports = ({ config }) => ({
  getWallet: getWallet({config}),
  createWallet: createWallet({config}),
  getAllWallets: getAllWallets({ config}),
  getWeb3WithWallet: getWeb3WithWallet({config}),
  walletExists: walletExists({ config }),
});
