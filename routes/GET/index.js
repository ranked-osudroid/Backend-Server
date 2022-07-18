const discord = require('./discord');
const verification = require('./verification');

const express = require('express');
const router = express.Router();

router.use('/discord', discord);
router.use('/verification', verification);

module.exports = router;