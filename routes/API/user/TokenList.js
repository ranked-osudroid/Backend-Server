const { MySQL, Logger, StringUtils, Utils } = require('../../../Utils');
const { ErrorCodes } = require('../../../logger/codes');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { tokens } = require('../../database/mongodb').schemas;

router.post('/', async (req, res) => {
    const logger = new Logger("TokenList", req.body);
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
        const deviceIDList = await MySQL.query(`SELECT deviceID FROM token WHERE uuid = '${uuid}';`);
        if (deviceIDList.length == 0) {
            logger.setErrorCode(ErrorCodes.PLAYER_NO_TOKENS);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        let sql = `SELECT uuid, md5, vaild, \`lock\`, createdTime, expiredTime FROM token WHERE uuid = '${uuid}'`;
        for (let i = 0; i < deviceIDList.length; i++) {
            sql += ` OR deviceID = '${deviceIDList[i]["deviceID"]}'`;
        }
        sql += ';';
        const tokenList = await MySQL.query(sql);
        const time = Utils.getUnixTime();
        while(true) {
            let id = StringUtils.getAlphaNumericString(7);
            try {
                await tokens.create({
                    id: id,
                    createdTime: time,
                    tokens: tokenList
                });
                const responseData = {
                    "id": id
                }
                logger.setOutput(responseData);
                const log = logger.success();
                res.send(log);
                return;
            }
            catch(e) {

            }
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