import getMappool from './GetMappool.js';
import mappoolerLogin from './MappoolerLogin.js';

import * as express from 'express';
const router = express.Router();

router.use('/mappoolerLogin', mappoolerLogin);
router.use('/getMappool', getMappool);

export default router;