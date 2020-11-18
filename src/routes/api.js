const express = require('express');

const router = express.Router();
/*** All request to /api comes here */

const AuthRoutes = require('./AuthRoutes') ;

router.use('/auth', AuthRoutes);


module.exports = router;