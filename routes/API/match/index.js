import createMatch from './CreateMatch.js';
import endMatch from './EndMatch.js';
import addRound from './AddRound.js';
import getMatch from './GetMatch.js';

import * as express from 'express';
const router = express.Router();

router.use('/createMatch', createMatch);
router.use('/endMatch', endMatch);
router.use('/addRound', addRound);
router.use('/getMatch', getMatch);

export default router;