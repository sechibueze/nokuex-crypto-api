
// const bitcoin = require("bitcoinjs-lib");
// const bigi    = require("bigi");
// const buffer  = require('buffer');
// const axios = require("axios").default;
const { validationResult } = require('express-validator');
// const BlockIo = require('../config/blockio.config')
const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
const TransferCrypto = require('../_helpers/transferCrypto')
const Transaction = require('../models/Transaction');
// const { key } = require("../config/blockio.config");

/*** Allow customers to initialize Transaction */
const initializeTransaction = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  // Passed all validations
  const { 
    amount,
    agent_username,
    wallet_address
  } = req.body;

  Agent.findOne({ username: agent_username }, (err , agent) => {

    if ( err ) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record'});
    
    if (!agent) return res.status(400).json({ status: false, error: 'missing Agent\'s detail'});

    // Found agent
    let newTransactionData = { 
      customer: req.authCustomer.id || req.authAdmin.id,
      amount,
      agent_username,
      wallet_address
    };

   

    const newTransaction = new Transaction(newTransactionData);
  
        newTransaction.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Customer' });

          
            return res.status(201).json({
              status: true,
              message: 'Initialized transaction successfully',
              data: newTransaction
            });
       
        })

      })
  
};

/*** Allow agents to  transfer btc to customers */
const completeTransaction = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  Transaction.findOne({ _id: req.params.transactionId })
  
  .then(transaction => {
    console.log('trnx', transaction )
    if (!transaction || transaction.status !== 'processing') {
      return res.status(400).json({
        status: false,
        error: 'Transaction is not due for processing'
      })
    }
    const source = {
      initialBalance: 0.01786381,
      private: "2bdc8af827e929de8b1b9eeb7ff15775b91a39e03c52fa3c483c7981dfcf4a4d",
      public: "03d5f95022aaeeaea28a6c7ba1bf317ae08e0e7527773f41b79ccf92edef6a87f7",
      address: "muESfmo9CSCpj66VvvxPwMZnq5sesV7WEG",
      wif: "cP3xndR1TRwQUPY26W5xZxGLM75cdh9dCBjeb91aMBhkwbTYC1G1"
    }
    const dest = {
      private: "82c0d694c7d4e80f8fd2932a83a22f0c0631207237a4adbb57ffca338fad58f0",
      public: "02037eece0b7c0d7500f0e012f445d7e15037cfd3e75b90fbeae3c7e6d9d4f015d",
      address: "mviPJ2vcmDNGCAGvX6fxonyKMfNFSiaNEE",
      wif: "cRxsMJGfnHHoYjFPA69phMqXTKXSoeY2qPp4g2AWwX3ptSzwkMTE"
    };

    const walletAddress = transaction.wallet_address;
    const amount = 100000;
    TransferCrypto(amount, dest.address, source.address, source.wif)
      .then(finaltx => {
         console.log('final ', finaltx)
         return res.json({
           data: finaltx
         })
      })
      .catch(error => {
        console.log('error ', error)
        return res.json({
          error: error
        })
      })
    
    

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

  Transaction.find(filter)
  .populate({
    path:"customer",
    model: Customer,
    select: ["firstname", "lastname", "email", "phone"]
  })
  // .populate({
  //   path: "agent_username",
  //   model: Agent,
  //   select: ["firstname", "lastname"]
  // })
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
  const roles = req.authCustomer.auth;

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

      /**** Found transaction */
      transaction.status = status;

      transaction.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Customer' });

          
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
  Transaction
    .find(filter)
    .then(tranx => {
      if (tranx.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No transactions was found'
        });
      }

      Transaction.deleteMany(filter, err => {
        
        if (err) {
                    
          return res.status(400).json({
            status: false,
            error: 'Failed to remove transactions',
            err: err
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Transactions removed',
          data: Date.now()
        });
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
  completeTransaction,
  loadAllTransactions,
  updateTransactionById,
  deleteTransactionsByFilter,
};