const { validationResult } = require('express-validator');
const { SUPPORTED_NETWORKS } = require('../models/constants');
const request = require('request')
const Rate = require('../models/Rate');


// Get All Rates by Admin
const getRates = (req, res) => {

  let filter = {};
  if (!req.authCustomer.roles.includes("admin")) {
    return res.status(401).json({
      status: false,
      error: 'Only admin can get agaents rate'
    })
  }

  Rate.find(filter)
    // .select('-password')
    .then(rates => {

      return res.status(200).json({
        status: true,
        message: 'All rates',
        data: rates
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve agents rate'
      })
    })
};

// Get All Rates by Admin
const getRatesByFilter = (req, res) => {

  let filter = {};
  const { id, agentId } = req.query;
//   const { id, agentId } = req.query;
  if (!req.authCustomer.roles.includes("agent") || !req.authCustomer.roles.includes("admin")) {
    return res.status(401).json({
      status: false,
      error: 'Only agent or admin can get agaents rate'
    })
  }

  if(id) filter._id = id;
  if(agentId) filter.agent = agentId;
  if(!id && !agentId) filter.agent = req.authCustomer.id;

  Rate.find(filter)
    // .select('-password')
    .then(rates => {

      return res.status(200).json({
        status: true,
        message: 'All rates based on filter',
        data: rates
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve agents rate'
      })
    })
};



/*** Create a new collection for products */
const deleteRateByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;
  if(id) filter._id = id;
  if (!req.authCustomer.roles.includes("admin")) {
    return res.status(401).json({
      status: false,
      error: 'Only admin can delete rate of agent'
    })
  }
  console.info('rate to delete', filter)
  Rate
    .find(filter)
    .then(rates => {
      console.info('About to delete ', rates)
      if (rates.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No Rate was found'
        });
      }

      try {
        rates.map(async c => await c.remove())
          return res.status(200).json({
            status: true,
            message: 'Rates removed',
            data: Date.now()
          });
        } catch (error) {
          return res.status(404).json({
            status: false,
            error: 'Failed to remove rates'
          });
        }
     
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Could not retrieve rate',
        err
      });
    });
};

const createRate = (req, res) => {
  const id = req.authCustomer.id;

  if (!req.authCustomer.roles.includes('agent')) {
    return res.status(404).json({
      status: false,
      error: 'Only agents are allowed'
    });
  }
  const {
      bitcoin_rate,
      ethereum_rate,
      tether_rate,
  } = req.body;
  // console.log('rate body', req.body)
  Rate.findOne({ agent: id})
    .then(existingRate => {
      if (existingRate) {
        console.info('Updating existingRate : ', existingRate.agent)
        if(bitcoin_rate) existingRate.bitcoin_rate = bitcoin_rate;
        if(ethereum_rate) existingRate.ethereum_rate = ethereum_rate;
        if(tether_rate) existingRate.tether_rate = tether_rate;
        
        return existingRate.save(err => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: 'Failed to update agent rate',
                     err
                });
            }
            return res.status(400).json({
                status: true,
                message: 'Updated agent rate',
                data: existingRate
            });
        })
      }
    //  Create a new rate
    let newRate = new Rate({
        bitcoin_rate, 
        ethereum_rate,
        tether_rate,
        agent: id
    })
    return newRate.save(err => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: 'Failed to update agent rate',
                    err
                });
            }
            return res.status(400).json({
                status: true,
                message: 'Updated agent rate',
                data: newRate
            });
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
  getRates,
  getRatesByFilter,
  createRate,
  deleteRateByFilter,
};