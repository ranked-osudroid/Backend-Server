import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { MySQL } from '#database';
import { RouterUtils, Utils } from '#utils';

import { Records } from '#schemas';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("expirePlayId", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "playId")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, playId } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        // const search = await MySQL.query('SELECT id FROM results WHERE id = ? AND played = 0', playId);

        // if(search.length == 0) {
        //     RouterUtils.fail(res, logger, ErrorCodes.EXPIRED_PLAYID);
        //     return;
        // }

        const search = await Records.findOne({
            id: playId,
            played: false
        });

        if(search == null) {
            RouterUtils.fail(res, logger, ErrorCodes.EXPIRED_PLAYID);
            return;
        }

        // await MySQL.query('UPDATE results SET `300x` = 0, `300` = 0, `100x` = 0, `100` = 0, `50` = 0, miss = 0, score = 0, acc = 0, `rank` = \'D\', mod_list = \'None\', maxCombo = 0, submitTime = UNIX_TIMESTAMP(), played = 1 WHERE id = ?', playId);

        Records.findOneAndUpdate({id: playId}, {
            perfectX: 0,
            perfect: 0,
            greatX: 0,
            great: 0,
            good: 0,
            miss: 0,
            score: 0,
            acc: 0,
            rank: "D",
            modList: [],
            maxCombo: 0,
            submitTime : () => Utils.getUnixTime(),
            played: true
        });

        const responseData = {
            "playId": playId
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