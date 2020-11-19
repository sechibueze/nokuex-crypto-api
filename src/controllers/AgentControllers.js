const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const Agent = require('../models/Agent');

/*** Handle Agent sign up request */
const createAgent = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  // Passed all validations
  const { 
    firstname, lastname, email, username, phone,
     home_address, bank_name, account_name, account_number, 
     payment_alert, email_alert, sms_alert
  } = req.body;

  Agent.findOne({ email }, (err , agent) => {

    if ( err ) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record'});
    
    if (agent) return res.status(400).json({ status: false, error: 'Agent record already exist'});

    // new Customer
    const defaultProfileImageUrl = gravatar.url(email, {s: '150', d: 'mm', r: 'pg'}, true);
    let defaultRoles = ['agent'];
    // if (roles === 'agent') defaultRoles = ['customer', 'agent'];
    let newAgentData = { 
      roles: defaultRoles , 
      firstname, lastname, phone, email, username, 
      home_address, bank_name, account_name, account_number,
      profileImage: defaultProfileImageUrl
    };

    if(payment_alert) newAgentData.payment_alert = payment_alert;
    if(email_alert) newAgentData.email_alert = email_alert;
    if(sms_alert) newAgentData.sms_alert = sms_alert;

    const newAgent = new Agent(newAgentData);
  
        newAgent.save(err => {
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Customer' });

          
            return res.status(201).json({
              status: true,
              message: 'Agent signup successful',
              data: newAgent
            });
       
        })

      })
  
};

// Load All Agents
const loadAllAgentsByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;

  if(id) filter._id = id;

  Agent.find(filter)
    .then(agents => {

      return res.status(200).json({
        status: true,
        message: 'Agnets List',
        data: agents
      });

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to retrieve agents list'
      })
    })
};

/*** Delete Agents by Filter */
const deleteAgentsByFilter = (req, res) => {
  let filter = {};
  const { id } = req.query;
  if(id) filter._id = id;
  Agent
    .find(filter)
    .then(agents => {
      if (agents.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No Agent was found'
        });
      }

      Agent.deleteMany(filter, err => {
        if (err) {
                    
          return res.status(404).json({
            status: false,
            error: 'Failed to remove agents'
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Agents removed',
          data: Date.now()
        });
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Could not retrieve Agents'
      });
    });
};



module.exports = {
  createAgent,
  loadAllAgentsByFilter,
  deleteAgentsByFilter
};