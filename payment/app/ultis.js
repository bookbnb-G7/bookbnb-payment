const BigNumber = require('bignumber.js');
const BookbnbABI = require('../abi/bookbnb-contract.json').abi;

const toWei = (number) => {
  const WEIS_IN_ETHER = new BigNumber(10).pow(18);
  return new BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const getContract = (web3, address) => {
  return new web3.eth.Contract(BookbnbABI, address);
};

const daysBetween = (initialDate, lastDate) => {
  const timeBetweenDates = lastDate.getTime() -  initialDate.getTime();
  return timeBetweenDates / (1000 * 3600 * 24);
};

const TransactionStatus = Object.freeze({
  "pending": 1,
  "confirmed": 2,
  'denied': 3
});


module.exports = {
  toWei,
  getContract,
  daysBetween,
  TransactionStatus
}
