const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const Customer = require('../models/Customer');

/*** Handle Customer sign up request */
const signup = (req, res) => {
  console.log('calling signup')
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  // Passed all validations
  const { firstname, lastname, email, phone, password, role } = req.body;
  Customer.findOne({ email }, (err , customer) => {

    if ( err ) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record'});
    
    if (customer) return res.status(400).json({ status: false, error: 'Customer record already exist'});

    // new Customer
    const defaultProfileImageUrl = gravatar.url(email, {s: '150', d: 'mm', r: 'pg'}, true);
    let defaultRoles = ['customer'];
    if (role === 'agent') defaultRoles = ['customer', 'agent'];
    const newCustomer = new Customer({ roles: defaultRoles , firstname, lastname, phone, email, password, profileImage: defaultProfileImageUrl});
    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to generate salt' });

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to hash password' });

        newCustomer.password = hash;
        newCustomer.save(err => {
          console.log('err ', err)
          if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to save Customerxx', errt: err });

          const payload = { id : newCustomer._id, auth: newCustomer.roles };
          jwt.sign(
            payload ,
            process.env.JWT_SECRET_KEY,
            { expiresIn: 60*60*3 },
            (err, token) => {
              if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to generate token' });

              return res.status(201).json({
                status: true,
                message: 'Customer signup successful',
                token
              });
            })
        })

      })
    })
  });
};


// / Login existing Customers
const login = (req, res) => {
  const errorsContainer = validationResult(req);
  if (!errorsContainer.isEmpty()) {
    return res.status(422).json({
      status: false,
      errors: errorsContainer.errors.map(err => err.msg)
    });
  }

  // Passed all validations
  const { email, password } = req.body;
  Customer.findOne({ email }, (err, customer) => {
    if (err) return res.status(500).json({ status: false, error: 'Server error:: Could not retrieve record' });

    if (!customer) return res.status(403).json({ status: false, error: 'Account does not exist' });

    // customer has account
      bcrypt.compare( password, customer.password, (err, isMatch) => {
        if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to compare password' });

        if (!isMatch) return res.status(401).json({ status: false, error: 'Account does not exist' });

        const payload = { id: customer._id, auth: customer.roles };
          jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: 60 * 60 * 60 },
            (err, token) => {
              if (err) return res.status(500).json({ status: false, error: 'Server error:: Failed to generate token' });

              return res.status(200).json({
                status: true,
                message: 'customer login successful',
                token
              });
            })
      })
  });
}

// Verify user with token
const getAuthenticatedCustomerData = (req, res) => {
  const currentCustomerId = req.authCustomer.id;

  Customer.findOne({_id: currentCustomerId})
    .select('-password')
    .then(customer => {

      return res.status(200).json({
        status: true,
        message: 'Authenticated Customer data',
        data: customer
      })

    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to authenticate user'
      })
    })
};


// Update Customers role 
const toggleCustomerAdminStatus = (req, res) => {
  
   const errorsContainer = validationResult(req);
    if (!errorsContainer.isEmpty()) {
      return res.status(422).json({
        status: false,
        errors: errorsContainer.errors.map(err => err.msg)
      });
    }
    
    const { email } = req.body;

  Customer.findOne({ email })
    .select('-password')
    .then(customer => {

      if (!customer) {
        return res.status(401).json({
          status: false,
          error: 'No customer account was found'
        })
      }

      // Customer has an account
      if (!customer.roles.includes('admin')) {
        customer.roles = [...customer.roles, 'admin'];
      }else{
        customer.roles = customer.roles.filter(role => role !== 'admin');  
      }

      customer.save(err => {
        if (err) {
          return res.status(500).json({
            status: false,
            error: 'Failed to update customer role'
          })
        }

        return res.status(200).json({
          status: true,
          message: 'Customer role has been updated accordingly',
          data: customer.roles
        });
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        error: 'Failed to find customer'
      })
    })
};


module.exports = {
  signup,
  login,
  getAuthenticatedCustomerData,
  toggleCustomerAdminStatus,
};