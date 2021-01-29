const express = require('express');

const router = express.Router();
/*** All request to /api comes here */

const AuthRoutes = require('./AuthRoutes');
const CustomersRoutes = require('./CustomersRoutes');
// const AgentsRoutes = require('./AgentsRoutes');
const WalletsRoutes = require('./WalletsRoutes');
const TransactionsRoutes = require('./TransactionsRoutes');

router.use('/auth', AuthRoutes);
router.use('/customers', CustomersRoutes);
router.use('/transactions', TransactionsRoutes);
router.use('/wallets', WalletsRoutes);
// router.use('/rates', RatesRoutes);


module.exports = router;