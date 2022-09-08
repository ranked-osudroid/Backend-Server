import { MySQL } from '#database';
import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("recentRecord", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "name")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, name } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const checkExist = await MySQL.query('SELECT uuid FROM user WHERE name = ?', name);
        if (checkExist.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.USER_NOT_EXIST);
            return;
        }
        const uuid = checkExist[0]["uuid"];
        const recentRecord = await MySQL.query('SELECT * FROM results WHERE uuid = ? AND played = 1 ORDER BY submitTime DESC', uuid);
        if (recentRecord.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYER_NO_RECORDS);
            return;
        }
        let responseData = {
            "id": recentRecord[0]["id"],
            "mapId": recentRecord[0]["map_id"],
            "mapSetId": recentRecord[0]["mapset_id"],
            "mapHash": recentRecord[0]["map_hash"],
            "300x": recentRecord[0]["300x"],
            "300": recentRecord[0]["300"],
            "100x": recentRecord[0]["100x"],
            "100": recentRecord[0]["100"],
            "50": recentRecord[0]["50"],
            "miss": recentRecord[0]["miss"],
            "score": recentRecord[0]["score"],
            "acc": recentRecord[0]["acc"],
            "rank": recentRecord[0]["rank"],
            "modList": recentRecord[0]["mod_list"],
            "maxCombo" : recentRecord[0]["maxCombo"],
            "submitTime": recentRecord[0]["submitTime"],
            "createdTime": recentRecord[0]["createdTime"],
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