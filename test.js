const BlockIo = require('./src/config/blockio.config')


/**
 * Send bitcoin in testnet using BlockCypher
 * @param {number} amount - Bitcoin amount in BTC
 * @param {string} to - output Bitcoin wallet address
 * @param {string} from - input Bitcoin wallet address
 * @param {string} wif 
 */

 let amount = 100000;
 let source = {
  initialBalance: 0.01786381,
  private: "2bdc8af827e929de8b1b9eeb7ff15775b91a39e03c52fa3c483c7981dfcf4a4d",
  public: "03d5f95022aaeeaea28a6c7ba1bf317ae08e0e7527773f41b79ccf92edef6a87f7",
  address: "muESfmo9CSCpj66VvvxPwMZnq5sesV7WEG",
  wif: "cP3xndR1TRwQUPY26W5xZxGLM75cdh9dCBjeb91aMBhkwbTYC1G1"
}
 
 let dest = {
  private: "82c0d694c7d4e80f8fd2932a83a22f0c0631207237a4adbb57ffca338fad58f0",
  public: "02037eece0b7c0d7500f0e012f445d7e15037cfd3e75b90fbeae3c7e6d9d4f015d",
  address: "mviPJ2vcmDNGCAGvX6fxonyKMfNFSiaNEE",
  wif: "cRxsMJGfnHHoYjFPA69phMqXTKXSoeY2qPp4g2AWwX3ptSzwkMTE"
};

let to = dest.address
 let from = source.address;
 let wif = source.wif
 let private = source.private;

BlockIo
  .get_address_balance({ address: '2N3HhGBDTVARQ96sKGAUYo56azd99EWtmRY'})
  .then(r => console.log('bal ', r))
  .catch(e => console.log(('e ', e)))

// BlockIo.widthdraw_from_addresses({ amount: .001,  from_addresses: '2N3HhGBDTVARQ96sKGAUYo56azd99EWtmRY' ,to_addresses: '2NBuBWfx4ZM8AJLqG7hGq4ysLzWFo3vdTjT' }).then(r => console.log('bal ', r)).catch(e => console.log(('e ', e)))

// sendBitcoin(amount, to, from, wif).then(res => console.log(res)).catch(err => console.log(err))