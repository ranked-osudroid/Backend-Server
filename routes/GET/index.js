const discord = require('./Discord');
const verification = require('./Verification');

const express = require('express');
const router = express.Router();

router.use('/discord', discord);
router.use('/verification', verification);

module.exports = router;