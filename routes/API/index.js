import match from './match/index.js';
import user from './user/index.js';
import game from './game/index.js';
import account from './account/index.js'

import * as express from 'express';
const router = express.Router();

// router.use('/', elo);
router.use('/', game);
router.use('/', account);
// router.use('/', mappool);
router.use('/', match);
router.use('/', user);

export default router;