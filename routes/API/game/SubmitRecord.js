import { MySQL } from '#database';
import { ErrorCodes } from '#codes';
import { StringUtils, RouterUtils } from '#utils';
import Logger from '#logger';

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

    if (secure != check) {
        RouterUtils.invalidSecure(res, logger);
        return;
    }

    try {
        const result = await MySQL.query(`SELECT id, played FROM results WHERE uuid = "${uuid}" AND played = 0 AND map_hash = "${mapHash}";`);
        if (result.length != 0) {
            const played = result[0]["played"];
            if (played == 1) {
                RouterUtils.fail(res, logger, ErrorCodes.EXPIRED_PLAYID);
                return;
            }
            await MySQL.query(`UPDATE results SET \`300x\` = ${_300x}, \`300\` = ${_300}, \`100x\` = ${_100x}, \`100\` = ${_100}, \`50\` = ${_50}, \`miss\` = ${miss}, \`score\` = ${score}, \`acc\` = "${acc}", \`submitTime\` = ${time}, \`mod_list\` = "${modList}", \`rank\` = "${rank}", maxCombo = ${maxCombo}, \`played\` = 1 WHERE id = "${result[0]["id"]}";`);
            let responseData = {
                "message": "Successfully submitted the score."
            }
            RouterUtils.success(res, logger, responseData);
            return;
        }
        else {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYID_NOT_FOUND);
            return;
        }
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;