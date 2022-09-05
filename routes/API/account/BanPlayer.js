import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { MySQL } from '#database';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {

    const logger = new Logger("BanPlayer", req.body);

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
        const searchPlayer = await MySQL.query(`SELECT banned FROM user WHERE uuid = '${uuid}';`);
        if(searchPlayer.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.USER_NOT_EXIST);
            return;
        }
        
        if(searchPlayer[0]["banned"] == 1) {
            RouterUtils.fail(res, logger, ErrorCodes.ALREADY_BANNED);
            return;
        }
        
        await MySQL.query(`UPDATE user SET banned = 1 WHERE uuid = '${uuid}';`);
        await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE uuid = '${uuid}';`);

        const responseData = {
            "message" : "Successfully banned"
        }
        RouterUtils.success(res, logger, responseData);
        return;
    }
    catch(e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;