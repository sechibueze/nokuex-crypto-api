const { validationResult } = require('express-validator');
const { SUPPORTED_NETWORKS } = require('../models/constants');
const request = require('request')
const Customer = require('../models/Customer');


// loadAllUCustomers
const loadAllCustomers = (req, res) => {

  let filter = {};
  const customerAuth = req.authCustomer.roles;
  if (!req.authCustomer.roles.includes("admin")) {
    return res.status(401).json({
      status: false,
      error: 'Only admin can get customers list'
    })
  }
  if(req.query.id) filter._id = req.query.id;


  Customer.find(filter)
    .select('-password')
    .then(customers => {

      return res.status(200).json({
        status: true,
        message: 'Customers List',
        data: customers
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve customers list'
      })
    })
};

/*** Create a new collection for products */
const deleteCustomersByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;
  if(id) filter._id = id;
  if (!req.authCustomer.roles.includes("admin")) {
    return res.status(401).json({
      status: false,
      error: 'Only admin can make agent'
    })
  }
  console.info('customer to delete', filter)
  Customer
    .find(filter)
    .then(customers => {
      console.info('About to delete ', customers)
      if (customers.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No Customer was found'
        });
      }

      try {
          customers.map(async c => await c.remove())
          return res.status(200).json({
            status: true,
            message: 'Customers removed',
            data: Date.now()
          });
        } catch (error) {
          return res.status(404).json({
            status: false,
            error: 'Failed to remove customers'
          });
        }
     
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Could not retrieve Customers',
        err
      });
    });
};

const createCustomerWallet = (req, res) => {
  const id = req.authCustomer.id;

  const { block } = req.params;
  if (!block || !SUPPORTED_NETWORKS.includes(block.trim().toUpperCase())) {
    console.warn('You must specifiy a block')
    return res.status(404).json({
      status: false,
      error: 'No valid block was set'
    });
  }
  Customer.findById({_id: id})
    .then(customer => {
      if (!customer) {
        console.warn('No customer to craete wallet for')
        return res.status(400).json({
          status: false,
          error: 'No Customer was found'
        });
      }

      let hasWalletInfo = false;
      const payload = {
        uri: '',
        block,
      }
      switch (block.trim().toUpperCase()) {
        case 'BTC':
          payload.uri = 'https://api.cryptoapis.io/v1/bc/btc/testnet/address';
          hasWalletInfo = customer.bitcoin_address ? true : false;
          break;
        case 'ETH':
          payload.uri = 'https://api.cryptoapis.io/v1/bc/eth/rinkeby/address';
          hasWalletInfo = customer.ethereum_address ? true : false;
        break;
      
        default:
          break;
      }

      if (hasWalletInfo) {
        return res.status(404).json({
          status: false,
          error: 'Wallet info exists for this network'
        });
      }
      request.post({
        url: payload.uri,
        headers:{
            'Content-Type': 'application/json',
            'x-api-key': process.env.CRYPTOAPIS_API_KEY
            },
            // body: JSON.stringify(payload)
        }, function(err, _res, _body) {
            if (err) {
                 console.log('error occured: ', err)
                  return res.status(404).json({
                    status: false,
                    error: 'Failed to create address',
                    err
                  });
            }
            const body = JSON.parse(_body)
            switch (block.trim().toUpperCase()) {
              case 'BTC':
                customer.bitcoin_public_key = body.payload.publicKey
                customer.bitcoin_private_key = body.payload.privateKey
                customer.bitcoin_address = body.payload.address
                customer.bitcoin_wifi = body.payload.wif
                break;
              case 'ETH':
                customer.ethereum_public_key = body.payload.publicKey
                customer.ethereum_private_key = body.payload.privateKey
                customer.ethereum_address = body.payload.address
                // customer.ethereum_wifi = body.payload.wif
                break;
            
              default:
                break;
            }
            
            
            customer.save(err => {
              if (err) {
                return res.status(404).json({
                  status: false,
                  error: 'Failed to save user address'
                });
              }

              return res.status(200).json({
                status: true,
                message: ' create address',
                data: customer,
                body
              });
            })
        })

    })
    .catch(err => {
      return res.status(404).json({
        status: false,
        error: 'Failed to get customer',
        id, err
      });
    })
}
module.exports = {
  loadAllCustomers,
  deleteCustomersByFilter,
  createCustomerWallet
};