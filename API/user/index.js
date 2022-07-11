const login = require('./Login');
const register = require('./Register');
const userinfo = require('./UserInfo');
const tokenList = require('./TokenList');
const banPlayer = require('./BanPlayer');
const createToken = require('./CreateToken');
const profileUpdate = require('./ProfileUpdate');

const express = require('express');
const router = express.Router();

router.use('/login', login);
router.use('/register', register);
router.use('/userInfo', userinfo);
router.use('/tokenList', tokenList);
router.use('/banPlayer', banPlayer);
router.use('/createToken', createToken);
router.use('/profileUpdate', profileUpdate);

module.exports = router;