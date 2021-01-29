const request = require('request')
// Code to send ether using Cryptoapis
// This was created by calling the create address endpoint
// This is the address to be credited by Nokuex
const src = {
    "address": "0xf09c22825fccb6a4cd7b0c89c7ff3b366fc1125d",
    "privateKey": "916c3eab85c0d1c0e515ad478b80414f831b39cf015b10ced3e47862c20ce546",
    "publicKey": "5afa7d322c7384b715a59c23873fe521eb0103225fabd638f3ef0fc65d00bfc6e1367a74c0ac17481878ccd073841bb0f2fbd08a8872e8cd6b79090f7ceb9460"
}

const dest = {
    "address": "0x16a4e9b23f44f27161f601f308009145324b6936",
    "privateKey": "436422f4e8233b1cd83819f2c7e1cb1856dedf18c54124574222b8eaef9e8db3",
    "publicKey": "e2434321d2d162bd5b161cd6e0753e821291659f352f26283babce05ebda4008cdb7578f92d63b80f1c9c1afdb631b9793e70e989351b674f303ec73676ab74e"
}

const checkEthereumBalance = () => {
    let address = src.address;
    const uri = `https://api.cryptoapis.io/v1/bc/eth/rinkeby/address/${address}/balance`;
    request.get({
        url: uri,
        headers:{
            'Content-Type': 'application/json',
            'x-api-key': 'ac08b49594f2fe482884d05e7732d1fd3924e787'
        },
        // body: JSON.stringify(payload)
    }, function(err, res, body) {
        if (err) {
            return console.warn('error :', err)
        }
        console.log('success : ', body)
    })
}

// Send tx using private keys
const sendTx = () => {
    
    const uri = 'https://api.cryptoapis.io/v1/bc/eth/rinkeby/txs/new-pvtkey';
    const payload = {
        "fromAddress" : src.address,
        "toAddress" : dest.address,
        "gasPrice" : 21000000000,
        "gasLimit" : 21000,
        "value" : 0.1,
        "privateKey" : src.privateKey
      }
    console.warn('loaded env', process.env.CRYPTOAPIS_API_KEY)
    request.post({
        url: uri,
        headers:{
            'Content-Type': 'application/json',
            'x-api-key': 'ac08b49594f2fe482884d05e7732d1fd3924e787'
        },
        body: JSON.stringify(payload)
    }, function(err, res, body) {
        if (err) {
            return console.log('error occured: ', err)
        }

        console.log('success: ', body)


    })
}
checkEthereumBalance()
sendTx()