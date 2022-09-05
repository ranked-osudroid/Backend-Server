import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { MySQL } from '#database';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("getMappool", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "uuid")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, uuid } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const checkMAppool = await MySQL.query(`SELECT uuid FROM mappool WHERE uuid = "${uuid}";`);
        if (checkMAppool.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.MAPPOOL_NOT_EXIST);
            return;
        }
        const maps = await MySQL.query(`SELECT * FROM maps WHERE inheritanceUUID = "${uuid}";`);
        let responseData = {
            "maps" : maps
        }
        RouterUtils.success(res, logger, responseData);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;