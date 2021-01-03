const BigNumber = require('bignumber.js');
const BookbnbABI = require('../abi/bookbnb-contract.json').abi;

const sqlDateonlyToDate = (sqlDateonly) => {
  // sqlDateonly format -> YYYY-MM-DD
  const split = sqlDateonly.split("-");
  return new Date(split[0], split[1] - 1, split[2]);
}

const toWei = (number) => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const getContract = (web3, address) => {
  return new web3.eth.Contract(BookbnbABI, address);
};

const daysBetween = (initialDate, lastDate) => {
  const timeBetweenDates = lastDate.getTime() -  initialDate.getTime();
  return Math.ceil(timeBetweenDates / (1000 * 60 * 60 * 24));
}

const TransactionStatus = Object.freeze({
  "pending": 1,
  "confirmed": 2,
  'denied': 3
});


module.exports = {
  toWei,
  getContract,
  daysBetween,
  sqlDateonlyToDate,
  TransactionStatus,
}
