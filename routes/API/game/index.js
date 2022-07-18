const submitRecord = require('./SubmitRecord');
const recentRecord = require('./RecentRecord');
const createPlayId = require('./CreatePlayId');
const expirePlayId = require('./expirePlayId');

const express = require('express');
const router = express.Router();

router.use('/submitRecord', submitRecord);
router.use('/recentRecord', recentRecord);
router.use('/createPlayId', createPlayId);
router.use('/expirePlayId', expirePlayId);

module.exports = router;