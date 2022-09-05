import submitRecord from './SubmitRecord.js';
import recentRecord from './RecentRecord.js';
import createPlayId from './CreatePlayId.js';
import expirePlayId from './ExpirePlayId.js';

import * as express from 'express';
const router = express.Router();

router.use('/submitRecord', submitRecord);
router.use('/recentRecord', recentRecord);
router.use('/createPlayId', createPlayId);
router.use('/expirePlayId', expirePlayId);

export default router;