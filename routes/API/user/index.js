import profileUpdate from './ProfileUpdate';
import userInfo from './UserInfo';

import * as express from 'express';
const router = express.Router();

router.use('/userInfo', userInfo);
router.use('/profileUpdate', profileUpdate);

export default router;