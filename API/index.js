const elo = require('./elo');
const game = require('./game');
const mappool = require('./mappool');
const match = require('./match');
const user = require('./user');

const express = require('express');
const router = express.Router();

router.use('/', elo);
router.use('/', game);
router.use('/', mappool);
router.use('/', match);
router.use('/', user);

module.exports = router;