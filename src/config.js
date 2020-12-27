const URL_NODE = process.env.URL_NODE || '';
const CTC_ADDR = process.env.CTC_ADDT || '';

const testURL = "https://mainnet.infura.io/v3/9a94f650c9e44801a0a7235e66059086";
const testCTC = '0xFfB1bA5e0418c2D30Ba920db902AC2E0dBbC0a5b';

const config = {
  urlNode: testURL,
  contractAddress: testCTC,
};

module.exports = config;
