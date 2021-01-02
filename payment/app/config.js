const URL_NODE = 'https://kovan.infura.io/v3/a6e4d308c9e0435394de58930c9fabe6'//process.env.URL_NODE || '';
const URL_WSKT = 'wss://kovan.infura.io/ws/v3/a6e4d308c9e0435394de58930c9fabe6' //process.env.URL_WSKT || '';
const CTC_ADDR = '0x82C39Ec55980Bce3CE4164c0De4fc6e27a7d3F28' //process.env.CTC_ADDR || '';

const config = {
  urlNode: URL_NODE,
  urlWebSocket: URL_WSKT,
  contractAddress: CTC_ADDR,
};

module.exports = config;
