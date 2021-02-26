const request = require('request')
// Code to send bitcoin using Cryptoapis
// This was created by calling the create address endpoint
// This is the address to be credited by Nokuex

// Bitcoin addresses
let source = {
    "privateKey": "bb2f6652d26ae48b9f89b7e10ff87924dd0f0b596a600e7067aa31cd6defdaa1",
    "publicKey": "02aacfa83534dba52af3bbd7b108c943fbc5c1d249a263a8717da366bdd90e0863",
    "address": "n3e7YvttciW8QPNnFYQVFCjiKtKkRyQeHv",
    "wif": "cTrZjKfThJxsLZ9j88kLJKrVsnULiWhttsmbUQDBoRHGaCjhWoeL"
}
   
let dest = {
    "privateKey": "b03302e04175fa9299345827141d377246cc8434e933a7731d4725e660ec119b",
    "publicKey": "0316a88b177f079a8ae2318b0cfdfb53c5df177f9244d7a1be5aeeb00bbf6022c2",
    "address": "muuwKm6FPLy3APJ88S9KRpZ7ruBf1PNQZd",
    "wif": "cTVD8diTvTsDeNUmHkyswzo1npSaHapBPEJswc4N6vC4Jym5UxRY"
};

// Prepare, Sign and Broadcast a Transaction
const sendTx = () => {
    // /v1/bc/btc/mainnet/txs/new
    const uri = 'https://api.cryptoapis.io/v1/bc/btc/testnet/txs/new';
    const payload = {
        "createTx": { 
                "inputs": [{
                "address": source.address,
                "value": 0.005
            }],
            "outputs": [{
                "address": dest.address,
                "value": 0.005
            }],
    
            "fee":  {
                "address": source.address,
                "value": 0.00023141
            }
        }, 
            "wifs" : [
                source.wif, dest.wif,
        ]
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