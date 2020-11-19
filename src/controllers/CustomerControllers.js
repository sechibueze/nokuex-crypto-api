const { validationResult } = require('express-validator');

const Customer = require('../models/Customer');


// loadAllUCustomers
const loadAllCustomers = (req, res) => {

  Customer.find()
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
  Customer
    .find(filter)
    .then(customers => {
      if (customers.length < 1) {
        return res.status(404).json({
          status: false,
          error: 'No Customer was found'
        });
      }

      Customer.deleteMany(filter, err => {
        if (err) {
                    
          return res.status(404).json({
            status: false,
            error: 'Failed to remove customers'
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Customers removed',
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
  loadAllCustomers,
  deleteCustomersByFilter,
};