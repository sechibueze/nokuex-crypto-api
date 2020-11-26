const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { addRate, loadAllRates, deleteRatesByFilter} = require('../controllers/RateControllers');
const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route POST /api/rates
 * @desc Add a new rate
 *@access private
 */
router.post('/',[
  check('product', 'product field is required').notEmpty(),
  check('trade_type', 'trade_type field is required').notEmpty(),
  check('agent_name', 'agent_name field is required').notEmpty(),
  check('rate_per_usd', 'rate_per_usd field is required').notEmpty(),
  check('min', 'min field is required').notEmpty(),
  check('max', 'max field is required').notEmpty(),
  check('bank', 'bank field is required').notEmpty(),
], checkAuthAdmin, addRate);


/*****
 * @route GET /api/rates
 * @desc Rate list
 *@access private
 */
router.get('/', checkAuthAdmin, loadAllRates);


/*****
 * @route DELETE /api/rates?id=<customer._id>
 * @desc Delete all rates
 *@access private
 */
router.delete('/', checkAuthAdmin, deleteRatesByFilter);



module.exports = router;