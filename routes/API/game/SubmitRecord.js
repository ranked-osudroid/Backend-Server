import { MySQL } from '#database';
import { ErrorCodes } from '#codes';
import { StringUtils, RouterUtils } from '#utils';
import Logger from '#logger';
import { Records } from '#schemas';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("submitRecord", req.body);

    if(!RouterUtils.isValidQuery(req.body,
        "secure",
        "_300x", "_300", "_100x", "_100",
        "_50", "miss", "score", "acc",
        "mapHash", "time", "uuid", "modList", "rank", "maxCombo")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }
    
    const { secure, _300x, _300, _100x, _100, _50, miss, score, acc, mapHash, time, uuid, modList, rank, maxCombo } = req.body;

    const check = StringUtils.getSecureString(_300x, _300, _100x, _100, _50, miss, score, acc, mapHash, time, modList, rank, maxCombo);

    if(secure != check) {
        RouterUtils.invalidSecure(res, logger);
        return;
    }

    try {
        const record = await Records.findOne({
            uuid: uuid,
            played: false,
            mapHash: mapHash
        });
        if(record != null) {
            Records.findOneAndUpdate({ id: record["id"]}, {
                perfectX: _300x,
                perfect: _300,
                greatX: _100x,
                great: _100,
                good: _50,
                miss: miss,
                score: score,
                acc: acc,
                modList: modList,
                rank: rank,
                maxCombo: maxCombo,
                submitTime: time,
                played: true
            });
            const responseData = {
                "message": "Successfully submitted the score."
            }
            RouterUtils.success(res, logger, responseData);
            return;
        }
        RouterUtils.fail(res, logger, ErrorCodes.PLAYID_NOT_FOUND);
        return;
        // const result = await MySQL.query('SELECT id, played FROM results WHERE uuid = ? and played = 0 and map_hash = ?', uuid, mapHash);
        // if (result.length != 0) {
        //     const played = result[0]["played"];
        //     if (played == 1) {
        //         RouterUtils.fail(res, logger, ErrorCodes.EXPIRED_PLAYID);
        //         return;
        //     }
        //     await MySQL.query('UPDATE results SET `300x` = ?, `300` = ?, `100x` = ?, `100` = ?, `50` = ?, miss = ?, score = ?, acc = ?, submitTime = ?, mod_list = ?, `rank` = ?, maxCombo = ?, played = 1 WHERE id = ?', _300x, _300, _100x, _100, _50, miss, score, acc, time, modList, rank, maxCombo, result[0]["id"]);
        //     let responseData = {
        //         "message": "Successfully submitted the score."
        //     }
        //     RouterUtils.success(res, logger, responseData);
        //     return;
        // }
        // else {
        //     RouterUtils.fail(res, logger, ErrorCodes.PLAYID_NOT_FOUND);
        //     return;
        // }
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;