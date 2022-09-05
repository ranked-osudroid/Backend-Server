import { ErrorCodes } from '#codes';
import { MySQL } from '#database';
import Logger from '#logger';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    const logger = new Logger("getMappool", req.body);

    try {
        const checkMappool = await MySQL.query(`SELECT * FROM mappool;`);
        RouterUtils.success(res, logger, checkMappool);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;