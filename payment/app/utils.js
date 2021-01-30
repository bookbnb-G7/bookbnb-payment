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

const fromWei = (number) => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).dividedBy(WEIS_IN_ETHER);
}

const getContract = (web3, address) => {
  return new web3.eth.Contract(BookbnbABI, address);
};

const daysBetween = (initialDate, lastDate) => {
  const timeBetweenDates = lastDate.getTime() -  initialDate.getTime();
  return Math.ceil(timeBetweenDates / (1000 * 60 * 60 * 24));
}

const getBalance = async (web3, address) => {
  const balance = await web3.eth.getBalance(address);
  return fromWei(balance);
}

const TransactionStatus = Object.freeze({
  "pending": 1,
  "confirmed": 2,
  'denied': 3
});

const apiKeyIsNotValid = (api_key) => {
  if (!api_key || api_key != process.env.API_KEY) {
    return true;
  }

  return false;
}

const payloadAttrIsValid = (payloadAttr, thingsToCheck, attrName) => {
  let error = null;

  if (!error && thingsToCheck["type"] && (typeof payloadAttr !== thingsToCheck["type"]))
    error = `Error in payload, ${attrName} should be a ${thingsToCheck["type"]}`;
  
  if (!error && thingsToCheck["min"] && payloadAttr < thingsToCheck["min"])
    error = `Error in payload, ${attrName} should be bigger than ${thingsToCheck["min"]}`;

  if (!error && thingsToCheck["max"] && payloadAttr > thingsToCheck["max"])
    error = `Error in payload, ${attrName} should be less than ${thingsToCheck["max"]}`;

  if (!error && thingsToCheck["isInteger"] === true && (payloadAttr % 1 !== 0))
    error = `Error in payload, ${attrName} should be shorter than ${thingsToCheck["length"]}`;

  if (!error && thingsToCheck["isDate"] === true) {
    let dateSplit = payloadAttr.split("-");
    if (dateSplit.length !== 3 || isNaN(new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0])))
      error = `Error in payload, ${attrName} should be a date-like string with the format YYYY-MM-DD`
  } 

  if (!error && thingsToCheck["length"] && payloadAttr.length > thingsToCheck["length"])
    error = `Error in payload, ${attrName} should be shorter than ${thingsToCheck["length"]}`;

  return error;
}

// attrsToCheck is dictionary like { "attr": { "type": type, "min": min, "max": max, "len": len } }
// and this function checks that the payload has every "attr" (not null) and verifies
// all the not null indications in every object of attrsToCheck
const payloadIsCorrect = (payload, attrsToCheck) => {
  let error = null;
  let attr = null;
  let attrKeys = Object.keys(attrsToCheck)
  let attrPos = 0;

  while (!error && attrPos < attrKeys.length) {
    attr = attrKeys[attrPos];
    if (payload[attr] != null)
      error = payloadAttrIsValid(payload[attr], attrsToCheck[attr], attr);
    else
      error = `Error in payload, ${attr} is not present`;

    attrPos = attrPos + 1;
  }

  return error;
}

module.exports = {
  toWei,
  getBalance,
  getContract,
  daysBetween,
  sqlDateonlyToDate,
  apiKeyIsNotValid,
  TransactionStatus,
  payloadIsCorrect,
}
