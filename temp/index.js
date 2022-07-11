const express = require('express');
const router = express.Router();
const tokenList = require('./TokenList');

router.use('/', tokenList);

module.exports = router;