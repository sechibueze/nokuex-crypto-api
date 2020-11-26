const { validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const Customer = require('../models/Customer');

const Transaction = require('../models/Transaction');

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
  loadAllTransactions,
  updateTransactionById,
  deleteTransactionsByFilter,
};