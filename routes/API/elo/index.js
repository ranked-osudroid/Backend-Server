const changeElo = require('./ChangeElo');

const express = require('express');
const router = express.Router();

router.use('/changeElo', changeElo);

module.exports = router;