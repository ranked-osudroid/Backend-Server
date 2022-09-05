import banPlayer from './BanPlayer.js';
import createToken from './CreateToken.js';
import login from './Login.js';
import register from './Register.js';
import tokenList from './TokenList.js';

import * as express from 'express';

const router = express.Router();

router.use('/banPlayer', banPlayer);
router.use('/createToken', createToken);
router.use('/login', login);
router.use('/register', register);
router.use('/tokenList', tokenList);

export default router;