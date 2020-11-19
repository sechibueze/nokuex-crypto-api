const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { 
  createAgent, loadAllAgentsByFilter, deleteAgentsByFilter,
} = require('../controllers/AgentControllers');
const checkAuthAdmin = require('../middlewares/checkAuthAdmin') ;

/*****
 * @route POST /api/agents
 * @desc Create an agent
 *@access private
 */
router.post('/', [
  check('firstname', 'Firstname field is required').notEmpty(),
  check('lastname', 'Lastname field is required').notEmpty(),
  check('username', 'Username field is required').notEmpty(),
  check('phone', 'Phone field is required').notEmpty(),
  check('email', 'Email field is required').isEmail(),
  check('home_address', 'Home Address field is required').notEmpty(),
  check('bank_name', 'Bank name field is required').notEmpty(),
  check('account_name', 'Account name field is required').notEmpty(),
  check('account_number', 'Account Number field is required').notEmpty(),
] ,checkAuthAdmin, createAgent);


/*****
 * @route GET /api/agents?id=<agent._id>
 * @desc get all agents
 *@access private
 */
router.get('/', checkAuthAdmin, loadAllAgentsByFilter);

/*****
 * @route DELETE /api/agents?id=<agent._id>
 * @desc Delete all agents
 *@access private
 */
router.delete('/', checkAuthAdmin, deleteAgentsByFilter);



module.exports = router;