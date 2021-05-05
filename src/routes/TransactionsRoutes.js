const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

const {
  initializeTransaction,
  loadTransactionById,
  completeTransaction,
  loadAllTransactions,
  deleteTransactionsByFilter,
  updateTransactionById,
  loadTransactionsByFilter,
  updateTransactionImage,
} = require("../controllers/TransactionControllers");
const checkAuthCustomer = require("../middlewares/checkAuthCustomer");
const checkAuthAdmin = require("../middlewares/checkAuthAdmin");

/*****
 * @route POST /api/transactions
 * @desc Initialize a new transaction
 *@access private
 */
router.post(
  "/:network",
  [
    check("amount", "Amount field is required").notEmpty(),
    check("agent_email", "Agent Email field is required").isEmail(),
    // check('destination_address', 'Destination address field is required').notEmpty(),
  ],
  checkAuthCustomer,
  initializeTransaction
);

/*****
 * @route GET /api/transactions
 * @desc Get Transaction by ID
 *@access private
 */
router.get("/:transactionId", checkAuthCustomer, loadTransactionById);

/*****
 * @route GET /api/transactions
 * @desc Transactions list
 *@access private
 */
router.get("/", checkAuthCustomer, loadAllTransactions);

/*****
 * @route GET /api/transactions/owners/filter?agentId=<_id>&customerId=<_id>
 * @desc Transactions list bu filter
 *@access private
 */
router.get("/owners/filter", checkAuthCustomer, loadTransactionsByFilter);

/*****
 * @route PUT /api/transactions/:transactionId
 * @desc Update Transactions status
 *@access private
 */
router.put(
  "/:transactionId",
  [check("status", "Status field is required").notEmpty()],
  checkAuthCustomer,
  updateTransactionById
);

/*****
 * @route PUT /api/transactions/image/:transactionId
 * @desc Update Transactions image
 *@access private
 */
router.put(
  "/image/:transactionId",
  uploads.single("transaction_image"),
  checkAuthCustomer,
  updateTransactionImage
);

/*****
 * @route PUT /api/transactions/:transactionId/complete
 * @desc Transfer to user
 *@access private
 */
router.put("/:transactionId/complete", checkAuthCustomer, completeTransaction);

/*****
 * @route DELETE /api/transactions
 * @desc Delete all transactions
 *@access private
 */
router.delete("/", checkAuthCustomer, deleteTransactionsByFilter);

module.exports = router;
