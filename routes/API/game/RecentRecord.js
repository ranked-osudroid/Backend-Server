import { MySQL } from '#database';
import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { RouterUtils } from '#utils';
import { Records } from '#schemas';

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
        // const recentRecord = await MySQL.query('SELECT * FROM results WHERE uuid = ? AND played = 1 ORDER BY submitTime DESC', uuid);
        // if (recentRecord.length == 0) {
        //     RouterUtils.fail(res, logger, ErrorCodes.PLAYER_NO_RECORDS);
        //     return;
        // }
        const recentRecord = await Records.findOne({
            uuid: uuid,
            played: true
        }).sort({ submitTime: 'desc'}).limit(1);

        if(recentRecord == null) {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYER_NO_RECORDS);
            return;
        }

        const responseData = {
            "id": recentRecord["id"],
            "mapId": recentRecord["map_id"],
            "mapSetId": recentRecord["mapset_id"],
            "mapHash": recentRecord["map_hash"],
            "300x": recentRecord["300x"],
            "300": recentRecord["300"],
            "100x": recentRecord["100x"],
            "100": recentRecord["100"],
            "50": recentRecord["50"],
            "miss": recentRecord["miss"],
            "score": recentRecord["score"],
            "acc": recentRecord["acc"],
            "rank": recentRecord["rank"],
            "modList": recentRecord["mod_list"],
            "maxCombo" : recentRecord["maxCombo"],
            "submitTime": recentRecord["submitTime"],
            "createdTime": recentRecord["createdTime"],
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