const express = require('express');
const router = express.Router();
const { Counter } = require('../users');

router.get('/', async (req, res) => {
    res.send(`Currently ${Counter.getOnlineUsers()} players are online.`);
    return;
});

module.exports = router;