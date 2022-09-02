import createMatch from './CreateMatch';
import endMatch from './EndMatch';
import addRound from './AddRound';
import getMatch from './GetMatch';

import * as express from 'express';
const router = express.Router();

router.use('/createMatch', createMatch);
router.use('/endMatch', endMatch);
router.use('/addRound', addRound);
router.use('/getMatch', getMatch);

export default router;