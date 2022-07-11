const mappoolerLogin = require('./MappoolerLogin');
const getMappool = require('./GetMappool');
const mappoolList = require('./MappoolList');

const express = require('express');
const router = express.Router();

router.use('/mappoolerLogin', mappoolerLogin);
router.use('/getMappool', getMappool);
router.use('/mappoolList', mappoolList);

module.exports = router;