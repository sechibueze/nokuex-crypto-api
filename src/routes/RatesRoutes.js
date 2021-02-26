const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { getRates, createRate, getRatesByFilter, deleteRateByFilter} = require('../controllers/RatesControllers');
const checkAuthCustomer = require('../middlewares/checkAuthCustomer') ;

/*****
 * @route GET /api/rates/
 * @desc Get all rates
 *@access private
 */
router.get('/',  checkAuthCustomer, getRates);

/*****
 * @route GET /api/rates/filter
 * @desc Get all rates by filter
 *@access private
 */
router.get('/filter',  checkAuthCustomer, getRatesByFilter);

/*****
 * @route POST /api/rates
 * @desc Add a new rate or update existing one
 *@access private
 */
router.post('/', checkAuthCustomer, createRate);

/*****
 * @route DELETE /api/rates/
 * @desc delete all rates by filter
 *@access private
 */
router.delete('/',  checkAuthCustomer, deleteRateByFilter);


module.exports = router;
