import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { RouterUtils, Utils } from '#utils';
import { MySQL } from '#database';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("endMatch", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "matchId", "aborted")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, matchId, aborted } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const searchMatch = await MySQL.query(`SELECT * FROM matches WHERE match_id = '${matchId}';`);
        if(searchMatch.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_NOT_EXIST);
            return;
        }

        if(searchMatch[0]["ended_time"] != -1) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_ALREADY_END);
            return;
        }

        const unixTime = Utils.getUnixTime();
        let responseData = {
            "aborted" : aborted == 1 ? 1 : 0,
            "endedTime" : unixTime
        };

        if(aborted == 1) {
            await MySQL.query(`UPDATE matches SET aborted = 1, ended_time = ${unixTime} WHERE match_id = '${matchId}';`);
        }
        else {
            await MySQL.query(`UPDATE matches SET ended_time = ${unixTime} WHERE match_id = '${matchId}';`);
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