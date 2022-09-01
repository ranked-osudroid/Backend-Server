import BanPlayer from './BanPlayer';
import CreateToken from './CreateToken';
import Login from './Login';
import Register from './Register';
import TokenList from './TokenList';

import * as express from 'express';

const router = express.Router();

router.use('/banPlayer', BanPlayer);
router.use('/createToken', CreateToken);
router.use('/login', Login);
router.use('/register', Register);
router.use('/tokenList', TokenList);

export default router;