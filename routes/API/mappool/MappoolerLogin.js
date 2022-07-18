const { ErrorCodes } = require('../../../logger/codes');
const { MySQL, StringUtils, Logger } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("mappoolerLogin", req.body);
    const { token, key } = req.body;

    if (!token || !key) {
        res.status(403).send(`Invalid Query`);
        logger.setErrorCode(ErrorCodes.INVALID_QUERY);
        logger.error(false);
        return;
    }

    if (key != process.env.KEY) {
        res.status(403).send(`Invalid Key`);
        logger.setErrorCode(ErrorCodes.INVALID_KEY);
        logger.error(false);
        return;
    }

    try {
        const checkToken = await MySQL.query(`SELECT uuid, vaild, \`lock\` FROM token WHERE md5 = "${StringUtils.getSecureString(token)}";`);
        if (checkToken.length == 0) {
            logger.setErrorCode(ErrorCodes.TOKEN_NOT_EXIST);
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
        const userInfo = await MySQL.query(`SELECT name, mappooler FROM user WHERE uuid = "${checkToken[0]["uuid"]}";`);
        let responseData = {
            "uuid": checkToken[0]["uuid"],
            "name": userInfo[0]["name"],
            "mappooler" : userInfo[0]["mappooler"]
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