const express = require('express');
const router = express.Router();
const discord = require('./discord');
const verification = require('./verification');

router.use('/discord', discord);
router.use('/verification', verification);

module.exports = router;