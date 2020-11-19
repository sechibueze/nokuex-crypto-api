const { validationResult } = require('express-validator');

const Rate = require('../models/Rate');

/*** Add a new rate for an agent */
const addRate = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  // Passed all validations
  const { 
    product, trade_type, rate_per_usd, 
    agent_name, min, max, bank
  } = req.body;

  Rate.findOne({ product, agent_name }, (err , rate) => {

    if ( err ) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record'});
    
    if (rate) return res.status(400).json({ status: false, error: 'Agent already entered rate for this product'});

    // new Rate
    let newRateData = { 
      product, trade_type, rate_per_usd, 
      agent_name, min, max, bank
    };

   

    const newRate = new Rate(newRateData);
  
        newRate.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Customer' });

          
            return res.status(201).json({
              status: true,
              message: 'Agent rate OK',
              data: newRate
            });
       
        })

      })
  
};


// load All rates
const loadAllRates = (req, res) => {

  Rate.find()
    // .select('-password')
    .then(rates => {

      return res.status(200).json({
        status: true,
        message: 'All rates ',
        data: rates
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve rates'
      })
    })
};

/*** Delete rates by Filter */
const deleteRatesByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;
  if(id) filter._id = id;
  Rate
    .find(filter)
    .then(rates => {
      if (rates.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No rate was found'
        });
      }

      Rate.deleteMany(filter, err => {
        if (err) {
                    
          return res.status(404).json({
            status: false,
            error: 'Failed to remove rates'
          });
        }

        return res.status(200).json({
          status: true,
          message: 'rates removed',
          data: Date.now()
        });
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Could not retrieve Customers'
      });
    });
};

module.exports = {
  addRate,
  loadAllRates,
  deleteRatesByFilter,
};