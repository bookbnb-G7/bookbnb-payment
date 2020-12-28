const URL_NODE = process.env.URL_NODE || '';
const CTC_ADDR = /*process.env.CTC_ADDR || */ '0x1b64677bdeaec34f1975fff8eccbafe4f277fdde';

const config = {
  urlNode: URL_NODE,
  contractAddress: CTC_ADDR,
};

console.log(config)

module.exports = config;
