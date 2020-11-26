const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { initializeTransaction, loadAllTransactions, deleteTransactionsByFilter, updateTransactionById} = require('../controllers/TransactionControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;
const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route POST /api/transactions
 * @desc Initialize a new transaction
 *@access private
//  */
router.post('/',[
  check('amount', 'Amount field is required').notEmpty(),
  check('agent_username', 'Agent Username field is required').notEmpty(),
  check('wallet_address', 'Wallet address field is required').notEmpty(),
], checkAuthCustomer, initializeTransaction);


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
 * @route DELETE /api/transactions
 * @desc Delete all transactions
 *@access private
 */
router.delete('/', checkAuthAdmin, deleteTransactionsByFilter);



module.exports = router;