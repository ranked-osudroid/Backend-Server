const express = require('express');
const router = express.Router();
const discord = require('./discord');
const verification = require('./verification');
const currentUsers = require('./currentUsers');

router.use('/currentUsers', currentUsers);
router.use('/discord', discord);
router.use('/verification', verification);

module.exports = router;