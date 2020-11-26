const express = require('express');

const router = express.Router();
/*** All request to /api comes here */

const AuthRoutes = require('./AuthRoutes');
const CustomersRoutes = require('./CustomersRoutes');
const AgentsRoutes = require('./AgentsRoutes');
const RatesRoutes = require('./RatesRoutes');
const TransactionsRoutes = require('./TransactionsRoutes');

router.use('/auth', AuthRoutes);
router.use('/customers', CustomersRoutes);
router.use('/agents', AgentsRoutes);
router.use('/rates', RatesRoutes);
router.use('/transactions', TransactionsRoutes);


module.exports = router;