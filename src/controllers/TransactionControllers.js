
// const bitcoin = require("bitcoinjs-lib");
// const bigi    = require("bigi");
// const buffer  = require('buffer');
// const axios = require("axios").default;
const { validationResult } = require('express-validator');
// const BlockIo = require('../config/blockio.config')
// const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
// const TransferCrypto = require('../_helpers/transferCrypto')
const Transaction = require('../models/Transaction');
const { SUPPORTED_NETWORKS, SUPPORTED_TRANSACTION_STATUS } = require('../models/constants')
// const { key } = require("../config/blockio.config");
// const getAPIkeyfromNetwork = require('../_helpers/getAPIkeyfromNetwork');


/*** Allow customers to initialize Transaction */
const initializeTransaction = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }
 
  // confirm the right network was specified
  const { network } = req.params;
  const _network = network ?  network.trim().toUpperCase() : "You did not set a network";
  if (!_network || !SUPPORTED_NETWORKS.includes(_network)) {
    return res.status(400).json({
      status: false,
      error: 'Invalid network specified'
    });
  }

  // Passed all validations
  const { 
    amount,
    agent_email,
    destination_address // increase balance if it is null
  } = req.body;

  Customer.findOne({ email: agent_email}, (err , agent) => {

    if ( err ) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record'});
    
    if (!agent) return res.status(400).json({ status: false, error: 'Agent no found'});
    if (!agent.roles.includes("agent")) return res.status(400).json({ status: false, error: 'You must do transx with an agent'});

    /***
     * Found agent,
     * So, prepare transaction data
     */ 
    let newTransactionData = { 
      customer: req.authCustomer.id,
      amount,
      network: network.trim().toUpperCase(),
      agent: agent._id,
      destination_address: destination_address ? destination_address : '',
    };
    /**
     * Save the transx for processing
     */
    const newTransaction = new Transaction(newTransactionData);
  
        newTransaction.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save transaction', err });

            return res.status(201).json({
              status: true,
              message: 'Transaction successfully initialized',
              data: newTransaction
            });
       
        })

      })
  
};

// load a single transaction by ID
const loadTransactionById = (req, res) => {
  
  // Pass ID as query 
  const id  = req.params.transactionId;
  if (!id) {
    return res.status(400).json({
      status: false,
      error: 'Invalid ID specified'
    });
  }
  let filter = {
    _id: id
  };
  const customerAuth = req.authCustomer.roles;
    if (!req.authCustomer.roles.includes("admin")) {
      return res.status(401).json({
        status: false,
        error: 'Only admin can make agent'
      })
    }

  Transaction.findOne(filter)
  .populate({
    path:"customer",
    model: Customer,
    select: ["firstname", "lastname", "email", "phone", "network", "amount"]
  })
  // .populate({
  //   path: "agent",
  //   model: Customer,
  //   select: ["firstname", "lastname"]
  // })
    .then(transaction => {

      return res.status(200).json({
        status: true,
        message: 'Requested Transaction',
        data: transaction
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve transaction'
      })
    })
};

const loadTransactionsByFilter = (req, res) => {
  // Pass ID as query 
  let filter = {};
  const { agentId, customerId} = req.query;
  const roles = req.authCustomer.roles;
  const currentUserId = req.authCustomer.id;

  // if(roles.includes('agent')) filter.agent = currentUserId;
  if(customerId) filter.customer = customerId;
  if(agentId) filter.agent = agentId;
  if(!agentId && !customerId) {
    return res.status(200).json({
      status: true,
      message: 'Please provide a filter',
      data: []
    });
  }
 
  Transaction.find(filter)
  .populate({
    path:"customer",
    model: Customer,
    select: ["firstname", "lastname", "email", "phone", "network", "amount"]
  })
  // .populate({
  //   path: "agent",
  //   model: Customer,
  //   select: ["firstname", "lastname"]
  // })
    .then(transx => {

      return res.status(200).json({
        status: true,
        message: 'Requested Transaction',
        data: transx
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve transaction',
        err
      })
    })
};

/*** Allow agents to  transfer CRYPTO to customers */
const completeTransaction = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  const { transactionId } = req.params;
  if (!transactionId) {
    return res.status(400).json({
      status: false,
      error: 'You have not specified a transaction ID'
    })
  }
  if (!req.authCustomer.roles.includes("agent")) {
    return res.status(400).json({
      status: false,
      error: 'Sorry, only agents can do this'
    })
  }

  Transaction.findOne({ _id:transactionId })
  .then(transaction => {
    if (!transaction || transaction.status !== 'PROCESSING') {
      return res.status(400).json({
        status: false,
        error: 'Transaction is not due for processing'
      })
    }

    const {customer, network, amount, agent, destination_address } = transaction;
    console.log('agent eq', req.authCustomer.id === agent.toString(), agent, req.authCustomer.id)
    if (req.authCustomer.id !== agent.toString() ) {
      return res.status(400).json({
        status: false,
        error: 'Agent must approve his trade'
      })
    }
    /**
     * Use the transaction data to find the 
     * coustomer(destination data) and agent(source data) for the transaction
     */
      Customer.findOne({ _id: customer })
        .then(customer => {
          console.info('customer : ', customer)
          if (!customer) {
            return res.status(400).json({
              status: false,
              error: 'No customer is connected with this transx'
            })
          }
          /**
           * Prepare destination data from customer info
           */
          const destination = {
            address: {
              bitcoin: customer.bitcoin_address,
              ethereum: customer.ethereum_address,
              tether: customer.tether_address,
            },
            publicKey: {
              bitcoin: customer.bitcoin_public_key,
              ethereum: customer.ethereum_public_key,
              tether: customer.tether_public_key,
            },
            privateKey: {
              bitcoin: customer.bitcoin_private_key,
              ethereum: customer.ethereum_private_key,
              tether: customer.tether_private_key,
            },
            wifi: {
              bitcoin: customer.bitcoin_wifi,
              ethereum: customer.ethereum_wifi,
              tether: customer.tether_wifi,
            }
          }

          // Confirm that trnsx hasnt been handled before
          if (customer.transaction_list.includes(transactionId)) {
            console.warn('Transaction have been complede before : ', customer.transaction_list, ' has ', transactionId)
            return res.status(400).json({
              status: false,
              error: 'No double spend is allowed, Tranx compledeted earlier'
            })
          }
          
          /***
           * Customer did not enter address
           * update his balance on Nokuex
           */
          console.info('checking destination_address in trx:', !transaction.destination_address )
          if (!transaction.destination_address) {
            console.info('newtwork', network )
            switch (network) {
              case 'BTC':
                customer.bitcoin_balance += amount;
                customer.transaction_list = [...customer.transaction_list, transactionId]
                break;
              case 'ETH':
                customer.ethereum_balance += amount;
                customer.transaction_list = [...customer.transaction_list, transactionId]
                break;
              case 'USDT':
                customer.tether_balance += amount;
                customer.transaction_list = [...customer.transaction_list, transactionId]
                break;
              default:
                console.warn('default: no match for crypto')
                break;
            }
  
            customer.save(err => {
              if (err) {
                return res.status(500).json({status: false, error: 'Failed to update customer', err})
  
              }
  
              return res.status(200).json({
                status: true,
                message: 'successfully updated payment',
                data: customer
              })
            })

          }else{

            /***
             * Customer entered an address,
             * Transfer to the respective address
             */
            //  Find the agent first
            Customer
            ``.findOne({ _id: agent })
              .then(agent => {

                if (!agent) {
                  return res.status(400).json({
                    status: false,
                    error: 'No agent is connected to this request',
                  })
                }

              /**
               * Found agent
               * Put together source information
               */
                const source = {
                  address: {
                    bitcoin: agent.bitcoin_address,
                    ethereum: agent.ethereum_address,
                    tether: agent.tether_address,
                  },
                  publicKey: {
                    bitcoin: agent.bitcoin_public_key,
                    ethereum: agent.ethereum_public_key,
                    tether: agent.tether_public_key,
                  },
                  privateKey: {
                    bitcoin: agent.bitcoin_private_key,
                    ethereum: agent.ethereum_private_key,
                    tether: agent.tether_private_key,
                  },
                  wifi: {
                    bitcoin: agent.bitcoin_wifi,
                    ethereum: agent.ethereum_wifi,
                    tether: agent.tether_wifi,
                  }
                }
              /**
               * Temp placeholder for API call info
               * Prepare API call data
               */
                let payload = {
                  uri: '',
                  body: '',
                }
                
                switch (network) {
                  case 'BTC':
                    payload.uri = 'https://api.cryptoapis.io/v1/bc/btc/testnet/txs/new';
                    payload.body = {
                        "createTx": { 
                                "inputs": [{
                                "address": source.address.bitcoin,
                                "value": amount
                            }],
                            "outputs": [{
                                "address": destination.address.bitcoin,
                                "value": amount
                            }],
                    
                            "fee":  {
                                "address": source.address.bitcoin,
                                "value": 0.00023141
                            }
                        }, 
                            "wifs" : [
                                source.wifi.bitcoin, destination.wifi.bitcoin,
                        ]
                    }
                    break;
                  case 'ETH':
                    payload.uri = 'https://api.cryptoapis.io/v1/bc/eth/rinkeby/txs/new-pvtkey';
                    payload.body = {
                      "fromAddress" : source.address.ethereum,
                      "toAddress" : destination.address.ethereum,
                      "gasPrice" : 21000000000,
                      "gasLimit" : 21000,
                      "value" : amount,
                      "privateKey" : source.privateKey.ethereum
                    }
                    break;
                  case 'USDT':
                    payload.uri = `https://api.cryptoapis.io/v1/bc/btc/omni/testnet/txs/new`;
                    payload.body = {
                      "from": source.address.tether, 
                      "to": destination.address.tether, 
                      "value": amount,
                      "fee": 0.00024,
                      "propertyID": 2,
                      "wif": source.wifi.tether,
                      "data": `Transfer ${amount}USDT from ${source.address.tether} to ${destination.address.tether}`
                    }
                    break;
                  default:
                    console.warn('default: no match for crypto')
                    break;
                }
      
                request.post({
                  url: payload.uri,
                  headers:{
                      'Content-Type': 'application/json',
                      'x-api-key': process.env.CRYPTOAPIS_API_KEY
                  },
                  body: JSON.stringify(payload.body)
                }, function(err, _res, _body) {
                  if (err) {
                      console.log('error occured: ', err);
                      return res.status(500).json({
                        status: false,
                        error: err
                      })
                  }

                  const body = JSON.parse(_body)
                  console.log('success: ', body)
                  txid = body.payload.txid;
                  transaction.status = "COMPLETED";
                  transaction.txId = txid;
                  transaction.save(err => {
                    if (err) {
                      return res.status(500).json({
                        status: false,
                        error: 'Failed to save transxID' , err
                      })
                    }
                    return res.status(200).json({
                      status: true,
                      message: 'Transaction done',
                      data: body
                    })
                  })
          
          
                })
        
      
                
              })
              .catch(err => res.status(500).json({status: false, error: 'Failed to get customer'}))
      
          }
         
        })
        .catch(err => res.status(500).json({status: false, error: 'Failed to get customer', err}))
    

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve transactions'
      })
    })
};


// load All transactions
const loadAllTransactions = (req, res) => {

  let filter = {};
  // const customerAuth = req.authCustomer.roles;
    if (!req.authCustomer.roles.includes("admin")) {
      return res.status(401).json({
        status: false,
        error: 'Only admin can make agent'
      })
    }

  Transaction.find(filter)
  .populate({
    path:"customer",
    model: Customer,
    select: ["firstname", "lastname", "email", "phone", "network", "amount"]
  })
    .then(transactions => {

      return res.status(200).json({
        status: true,
        message: 'All Transactions ',
        data: transactions
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve transactions'
      })
    })
};

// Update transactions
const updateTransactionById = (req, res) => {
  const id = req.authCustomer.id;
  const roles = req.authCustomer.roles;
  // const customerAuth = req.authCustomer.roles;
    if (!roles.includes("agent")) {
      return res.status(401).json({
        status: false,
        error: 'Only agent can update transx'
      })
    }

  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  if (!req.params.transactionId) {
    return res.status(400).json({
        status: false,
        error: 'Invalid request: No tranx ID specified'
      })
  }
  
  const { status } = req.body;

  Transaction.findOne({_id: req.params.transactionId})
    .then(transaction => {

      if (!transaction) {
        return res.status(400).json({
          status: false,
          error: 'No transaction identified'
        })
      }
      if (transaction.agent.toString() !== id ) {
        return res.status(401).json({
          status: false,
          error: 'You can only update you transactions'
        })
      }

      /**** Found transaction */
      const _status = status.trim().toUpperCase();
      if (SUPPORTED_TRANSACTION_STATUS.includes(_status)) {
        transaction.status = _status;
      }

      transaction.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Transaction' });

          
            return res.status(201).json({
              status: true,
              message: 'updated transaction successfully',
              data: transaction.status
            });
       
        })
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve transactions'
      })
    })
};

/*** Delete transactions by Filter */
const deleteTransactionsByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;
  if(id) filter._id = id;
  const customerAuth = req.authCustomer.roles;
    if (!req.authCustomer.roles.includes("admin")) {
      return res.status(401).json({
        status: false,
        error: 'Only admin can delete transx'
      })
    }
  Transaction
    .find(filter)
    .then(tranx => {
      if (tranx.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No transactions was found'
        });
      }

      tranx.map(async tx => {
        try {
          await tx.remove()
          return res.status(200).json({
                status: true,
                message: 'Transactions removed',
                data: Date.now()
              });
        } catch (error) {
          return res.status(400).json({
            status: false,
            error: 'Failed to remove transactions',
            err: error
          });
        }
      })

      
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Could not retrieve transactions'
      });
    });
};

module.exports = {
  initializeTransaction,
  loadTransactionById,
  loadAllTransactions,
  completeTransaction,
  updateTransactionById,
  deleteTransactionsByFilter,
  loadTransactionsByFilter,
};