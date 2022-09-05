import changeElo from './changeElo.js';

import * as express from 'express';
const router = express.Router();

router.use('/changeElo', changeElo);

export default router;