const express = require('express');

const router = express.Router();
/*** All request to /api comes here */

const AuthRoutes = require('./AuthRoutes');
const CustomersRoutes = require('./CustomersRoutes');
const AgentsRoutes = require('./AgentsRoutes');
const RatesRoutes = require('./RatesRoutes');

router.use('/auth', AuthRoutes);
router.use('/customers', CustomersRoutes);
router.use('/agents', AgentsRoutes);
router.use('/rates', RatesRoutes);


module.exports = router;