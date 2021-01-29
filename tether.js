const request = require('request')
// Code to send tether using Cryptoapis
// This was created by calling the create address endpoint
// This is the address to be credited by Nokuex

// Bitcoin addresses
let source = {
    initialBalance: 0.01786381,
    private: "2bdc8af827e929de8b1b9eeb7ff15775b91a39e03c52fa3c483c7981dfcf4a4d",
    public: "03d5f95022aaeeaea28a6c7ba1bf317ae08e0e7527773f41b79ccf92edef6a87f7",
    address: "muESfmo9CSCpj66VvvxPwMZnq5sesV7WEG",
    wif: "cP3xndR1TRwQUPY26W5xZxGLM75cdh9dCBjeb91aMBhkwbTYC1G1"
  }
let source2 = {
    private: "82c0d694c7d4e80f8fd2932a83a22f0c0631207237a4adbb57ffca338fad58f0",
    public: "02037eece0b7c0d7500f0e012f445d7e15037cfd3e75b90fbeae3c7e6d9d4f015d",
    address: "mviPJ2vcmDNGCAGvX6fxonyKMfNFSiaNEE",
    wif: "cRxsMJGfnHHoYjFPA69phMqXTKXSoeY2qPp4g2AWwX3ptSzwkMTE"
  }
   
let dest = {
    "privateKey": "92e1de62e02e90aaa06a4f3cbf81f3c517b83cf62958ab42d0b7334a5fb36f4a",
    "publicKey": "0210804bb3ee2cfcc4f999da4ac6d78447e46a340cee168a28db539415071cfb45",
    "address": "n3ngvQvprEsLifxbVq5isemhWRxU82UtFj",
    "wif": "cSWDoqiEsjrAoZoLAY58Tf2msH13vU7s1N8ymzySfwmohnaCV63N"
};

// Prepare, Sign and Broadcast a Transaction
const sendTx = () => {
    
    const uri = 'https://api.cryptoapis.io/v1/bc/btc/omni/testnet/txs/new';
    const payload = {
        "from": source2.address, 
        "to": dest.address, 
        "value": 0.00013,
        "fee": 0.00024,
        "propertyID": 2,
        "wif": source2.wif,
        "data": "this is so cool!"
    }
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

sendTx()