const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { createCustomerWallet} = require('../controllers/CustomerControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;
const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route GET /api/wallets/:block
 * @desc Create a wallet for a user
 *@access private
 */
router.put('/:block',  checkAuthCustomer, createCustomerWallet);





module.exports = router;
