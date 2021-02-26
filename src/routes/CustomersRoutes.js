const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { loadAllCustomers, deleteCustomersByFilter,} = require('../controllers/CustomerControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;
// const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route GET /api/customers
 * @desc Customer list by filter
 *@access private
 */
router.get('/', checkAuthCustomer, 
loadAllCustomers);


/*****
 * @route DELETE /api/customers?id=<customer._id>
 * @desc Delete all customers
 *@access private
 */
router.delete('/', checkAuthCustomer, 
deleteCustomersByFilter);

/*****
 * @route PUT /api/customers/:id/wallet
 * @desc Delete all customers
 *@access private
 */
// router.delete('/', // checkAuthAdmin, 
// deleteCustomersByFilter);



module.exports = router;
