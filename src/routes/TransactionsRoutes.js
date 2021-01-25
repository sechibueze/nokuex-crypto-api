

const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { 
  initializeTransaction, 
  loadTransactionById,
  completeTransaction, 
  loadAllTransactions, 
  deleteTransactionsByFilter, 
  updateTransactionById
} = require('../controllers/TransactionControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;
const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route POST /api/transactions
 * @desc Initialize a new transaction
 *@access private
 */
router.post('/:network',[
  check('amount', 'Amount field is required').notEmpty(),
  check('agent', 'Agent Username field is required').isEmail(),
  check('destination_address', 'Wallet address field is required').notEmpty(),
], checkAuthCustomer, initializeTransaction);


/*****
 * @route GET /api/transactions
 * @desc Get Transaction by ID
 *@access private
 */
router.get('/', loadTransactionById);

/*****
 * @route GET /api/transactions
 * @desc Transactions list
 *@access private
 */
router.get('/', checkAuthAdmin, loadAllTransactions);

/*****
 * @route PUT /api/transactions/:transactionId
 * @desc Update Transactions status
 *@access private
 */
router.put('/:transactionId',[
  check('status', 'Status field is required').notEmpty(),
], checkAuthCustomer, updateTransactionById);


/*****
 * @route PUT /api/transactions/:transactionId/complete
 * @desc Transfer to user
 *@access private
 */
router.put('/:transactionId/complete',
 checkAuthAdmin, 
 completeTransaction);


/*****
 * @route DELETE /api/transactions
 * @desc Delete all transactions
 *@access private
 */
router.delete('/', checkAuthAdmin, deleteTransactionsByFilter);



module.exports = router;