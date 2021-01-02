const URL_NODE = process.env.URL_NODE || '';
const URL_WSKT = process.env.URL_WSKT || '';
const CTC_ADDR = process.env.CTC_ADDR || '';

const config = {
  urlNode: URL_NODE,
  urlWebSocket: URL_WSKT,
  contractAddress: CTC_ADDR,
};

module.exports = config;
