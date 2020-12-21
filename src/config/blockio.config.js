const BlockIo = require('block_io');
const BlockIO = new BlockIo(process.env.BLOCKIO_BITCOIN_API_KEY);

module.exports = BlockIO;