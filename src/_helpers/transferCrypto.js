const request = require('request');
const bitcoin = require("bitcoinjs-lib");
const buffer  = require('buffer');


const sendBitcoin = function (amount, to, from, wif = '' ) {
    const bitcoinNetwork = bitcoin.networks.testnet;
    let keys = bitcoin.ECPair.fromWIF(wif, bitcoinNetwork);
    // const keyBuffer = Buffer.from(private, 'hex')
    //   const keys = bitcoin.ECPair.fromPrivateKey(keyBuffer)
      // console.log('generated keys', keys)
    return new Promise(function (resolve, reject) {
      // create tx skeleton
      request.post({
        url: 'https://api.blockcypher.com/v1/btc/test3/txs/new',
          body: JSON.stringify({
            inputs: [{ addresses: [ from ] }],
            // convert amount from BTC to Satoshis
            outputs: [{ addresses: [ to ], value: amount //* Math.pow(10, 8) 
            }]
          }),
        },
        function (err, res, body) {
          if (err) {
            reject(err);        
          } else {
            let tmptx = JSON.parse(body);
  
            // signing each of the hex-encoded string required to finalize the transaction
            tmptx.pubkeys = [];
            tmptx.signatures = tmptx.tosign.map(function (tosign, n) {
              tmptx.pubkeys.push(keys.publicKey.toString('hex'));
              // return keys.sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
              const SIGHASH_ALL = 0x01;
              return bitcoin.script.signature.encode(
                keys.sign(new buffer.Buffer(tosign, "hex")),
                SIGHASH_ALL,
              ).toString("hex").slice(0, -2);
  
            });
  
            // sending back the transaction with all the signatures to broadcast
            request.post({
              url: 'https://api.blockcypher.com/v1/btc/test3/txs/send',
                body: JSON.stringify(tmptx),
              },
              function (err, res, body) {
                if (err) {
                  reject(err);
                } else {
                  // return tx hash as feedback
                  // console.log('finaltx res', res)
                  let finaltx = JSON.parse(body);                
                  resolve(finaltx);
                }
              }
            );
          }
        }
      );
    });
  }

const sendEthereum = function (params) {
  
}
module.exports = sendBitcoin;