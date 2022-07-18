import { Logger } from '@logger';
import { ErrorCodes } from '@logger/codes';
import { query } from '@database/mysql';
import { RouterUtils } from '@Utils';

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
        const searchPlayer = await query(`SELECT banned FROM user WHERE uuid = '${uuid}';`);
        if(searchPlayer.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.USER_NOT_EXIST);
            return;
        }
        
        if(searchPlayer[0]["banned"] == 1) {
            RouterUtils.fail(res, logger, ErrorCodes.ALREADY_BANNED);
            return;
        }
        
        await query(`UPDATE user SET banned = 1 WHERE uuid = '${uuid}';`);
        await query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE uuid = '${uuid}';`);

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

module.exports = router;