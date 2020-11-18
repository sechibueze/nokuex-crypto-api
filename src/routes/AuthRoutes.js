const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { signup, login, getAuthenticatedCustomerData} = require('../controllers/AuthControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;

/*****
 * @route POST /api/auth/signup
 * @desc Customer signup
 *@access public
 */
router.post('/signup', [
  check('firstname', 'Firstname field is required').notEmpty(),
  check('lastname', 'Lastname field is required').notEmpty(),
  check('email', 'Email field is required').isEmail(),
  check('password', 'password field is required').notEmpty(),
]
 , signup );


/*****
 * @route POST /api/auth/login
 * @desc Customer login
 *@access public
 */
router.post('/login', [
   check('email', 'Email field is required').isEmail(),
  check('password', 'password field is required').notEmpty(),
], login );

/*****
 * @route GET /api/auth/
 * @desc Customer signup
 *@access public
 */
router.get('/', checkAuthCustomer, getAuthenticatedCustomerData );


module.exports = router;