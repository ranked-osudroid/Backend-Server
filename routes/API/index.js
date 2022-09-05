import match from './match/index.js';
import user from './user/index.js';

import * as express from 'express';
const router = express.Router();

// router.use('/', elo);
// router.use('/', game);
// router.use('/', mappool);
router.use('/', match);
router.use('/', user);

export default router;