const { StringUtils, Logger, MySQL } = require('../../../Utils');
const { ErrorCodes } = require('../../../logger/codes');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createToken", req.body);
    const { key, uuid } = req.body;

    if (!key || !uuid) {
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
        const userCheck = await MySQL.query(`SELECT uuid FROM user WHERE uuid = "${uuid}";`);
        if (userCheck.length == 0) {
            logger.setErrorCode(ErrorCodes.USER_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        const vaildId = await MySQL.query(`SELECT md5 FROM token WHERE uuid = "${uuid}" AND vaild = 1;`);
        for (let i = 0; i < vaildId.length; i++) {
            await MySQL.query(`UPDATE token SET vaild = 0, expiredTime = UNIX_TIMESTAMP() WHERE md5 = "${vaildId[i]["md5"]}";`);
        }
        while (true) {
            const id = StringUtils.getAlphaNumericString(7);
            const idCheck = await MySQL.query(`SELECT md5 FROM token WHERE md5 = "${StringUtils.getSecureString(id)}"`);
            if (idCheck.length != 0) {
                continue;
            }
            await MySQL.query(`INSERT INTO \`token\`(\`uuid\`, \`md5\`, \`createdTime\`) VALUES ("${uuid}", "${StringUtils.getSecureString(id)}", UNIX_TIMESTAMP());`);
            let responseData = {
                "id": id,
            }
            logger.setOutput(responseData);
            const log = logger.success();
            res.send(log);
            return;
        }
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