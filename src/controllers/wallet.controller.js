const HDWalletProvider = require('truffle-hdwallet-provider');
const { Wallet } = require('../models/wallet');
const bip39 = require('bip39');
const Web3 = require('web3');


const createWallet = ({ config }) => async (uuid) => {
  const mnemonic = bip39.entropyToMnemonic(
    (Math.random() * 10000000000000000000).toString().split('.')[0].padStart(32, '0')
  );

  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  const web3 = new Web3(provider);
  const currentAccounts = await web3.eth.getAccounts();

  return await Wallet.create({
    uuid: uuid,
    mnemonic: mnemonic,
    address: currentAccounts[0]
  });
};

const getAllWallets = () => {
  Wallet.findAll({raw: true}).then((wallets) => {
    return wallets;
  });
}

const getWallet = (uuid) => {
  return Wallet.findOne({ where: {uuid: uuid} }).then((wallet) => {
    if (wallet) {
      return wallet.toJSON();
    } else {
      return {error: "not found"};
    }
  });
};

const getWalletWithWeb3 = ({ config }) => (uuid) => {
  const mnemonic = getWallet(uuid).mnemonic;
  const provider = new HDWalletProvider(mnemonic, config.urlNode);
  return new Web3(provider);
};

module.exports = ({ config }) => ({
  getWallet,
  getAllWallets,
  createWallet: createWallet({config}),
  getWeb3WithWallet: getWalletWithWeb3({config}),
});
