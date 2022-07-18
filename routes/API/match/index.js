const createMatch = require('./createMatch');
const endMatch = require('./endMatch');
const addRound = require('./addRound');
const getMatch = require('./getMatch');

const express = require('express');
const router = express.Router();

router.use('/createMatch', createMatch);
router.use('/endMatch', endMatch);
router.use('/addRound', addRound);
router.use('/getMatch', getMatch);

module.exports = router;