import profileUpdate from './ProfileUpdate.js';
import userInfo from './UserInfo.js';

import * as express from 'express';
const router = express.Router();

router.use('/userInfo', userInfo);
router.use('/profileUpdate', profileUpdate);

export default router;