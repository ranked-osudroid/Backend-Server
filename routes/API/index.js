import match from './match';
import user from './user';

import * as express from 'express';
const router = express.Router();

// router.use('/', elo);
// router.use('/', game);
// router.use('/', mappool);
router.use('/', match);
router.use('/', user);

export default router;