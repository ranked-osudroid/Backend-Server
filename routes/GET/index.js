import discord from './Discord.js';
import verification from './Verification.js';
import tokenList from './TokenList.js';
import mappoolList from './MappoolList.js';

import * as express from 'express';
const router = express.Router();

router.use('/discord', discord);
router.use('/verification', verification);
router.use('/tokenList', tokenList);
router.use('/mappoolList', mappoolList);

export default router;