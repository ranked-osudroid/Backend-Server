const { ErrorCodes } = require('../../../logger/codes');
const { MySQL, StringUtils, Logger } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("login", req.body);
    const { token, deviceid, secure } = req.body;

    if (!token || !deviceid || !secure) {
        res.status(403).send(`Invalid Query`);
        logger.setErrorCode(ErrorCodes.INVALID_QUERY);
        logger.error(false);
        return;
    }

    const secureString = StringUtils.getSecureString(token, deviceid, process.env.VERSION_NAME);

    if (secure != secureString) {
        res.status(403).send(`Invalid Secure`);
        logger.setErrorCode(ErrorCodes.INVALID_SECURE);
        logger.error(false);
        return;
    }

    try {
        const checkToken = await MySQL.query(`SELECT uuid, deviceID, vaild, \`lock\` FROM token WHERE md5 = "${StringUtils.getSecureString(token)}";`);
        if (checkToken.length == 0) {
            logger.setErrorCode(ErrorCodes.TOKEN_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        if (checkToken.length >= 2) {
            await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE deviceID = "${deviceid}";`);
            logger.setErrorCode(ErrorCodes.ILLEGAL_LOGIN);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        if (checkToken[0]["lock"] == 1) {
            logger.setErrorCode(ErrorCodes.TOKEN_LOCKED);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        if (checkToken[0]["vaild"] == 0) {
            logger.setErrorCode(ErrorCodes.TOKEN_EXPIRED);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        if (checkToken[0]["deviceID"] != deviceid) {
            if (checkToken[0]["deviceID"] == null) {
                await MySQL.query(`UPDATE token SET deviceID = "${deviceid}" WHERE md5 = "${StringUtils.getSecureString(token)}";`);
            }
            else {
                await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE md5 = "${StringUtils.getSecureString(token)}";`);
                logger.setErrorCode(ErrorCodes.ILLEGAL_LOGIN);
                const log = logger.error(false);
                res.send(log);
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
        logger.setOutput(responseData);
        const log = logger.success();
        res.send(log);
        return;
    }
    catch (e) {
        logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
        logger.setErrorStack(e);
        const log = logger.error(true);
        res.status(500).send(log);
        return;
    }
});

module.exports = router;