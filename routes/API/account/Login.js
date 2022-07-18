import { MySQL } from '@database';
import { Logger } from '@logger';
import { ErrorCodes } from '@logger/codes';
import { RouterUtils, StringUtils } from '@utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("login", req.body);

    if(!RouterUtils.isValidQuery(req.body, "token", "deviceid", "secure")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { token, deviceid, secure } = req.body;

    const secureString = StringUtils.getSecureString(token, deviceid, process.env.VERSION_NAME);

    if (secure != secureString) {
        RouterUtils.invalidSecure(res, logger);
        return;
    }

    try {
        const checkToken = await MySQL.query(`SELECT uuid, deviceID, vaild, \`lock\` FROM token WHERE md5 = "${StringUtils.getSecureString(token)}";`);
        if (checkToken.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_NOT_EXIST);
            return;
        }
        if (checkToken.length >= 2) {
            await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE deviceID = "${deviceid}";`);
            RouterUtils.fail(res, logger, ErrorCodes.ILLEGAL_LOGIN);
            return;
        }
        if (checkToken[0]["lock"] == 1) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_LOCKED);
            return;
        }
        if (checkToken[0]["vaild"] == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_EXPIRED);
            return;
        }
        if (checkToken[0]["deviceID"] != deviceid) {
            if (checkToken[0]["deviceID"] == null) {
                await MySQL.query(`UPDATE token SET deviceID = "${deviceid}" WHERE md5 = "${StringUtils.getSecureString(token)}";`);
            }
            else {
                await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE md5 = "${StringUtils.getSecureString(token)}";`);
                RouterUtils.fail(res, logger, ErrorCodes.ILLEGAL_LOGIN);
                return;
            }
        }
        const userInfo = await MySQL.query(`SELECT name, discord_id, profile, mappooler, staff FROM user WHERE uuid = "${checkToken[0]["uuid"]}";`);
        let responseData = {
            "uuid": checkToken[0]["uuid"],
            "name": userInfo[0]["name"],
            "profile": userInfo[0]["profile"],
            "mappooler": userInfo[0]["mappooler"] * 1,
            "staff": userInfo[0]["staff"] * 1,
            "discord_id": userInfo[0]["discord_id"]
        }
        RouterUtils.success(res, logger, responseData);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

module.exports = router;