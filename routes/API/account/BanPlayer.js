const path = require('path');
const { Logger } = require(path.join(__dirname, '/logger'));
const { ErrorCodes } = require(path.join(__dirname, '/logger/codes'));
const mysql = require(path.join(__dirname, 'database/mysql/mysql'));


const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("BanPlayer", req.body);
    const { key, uuid } = req.body;

    if(!key || !uuid) {
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
        const searchPlayer = await MySQL.query(`SELECT banned FROM user WHERE uuid = '${uuid}';`);
        if(searchPlayer.length == 0) {
            logger.setErrorCode(ErrorCodes.USER_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        
        if(searchPlayer[0]["banned"] == 1) {
            logger.setErrorCode(ErrorCodes.ALREADY_BANNED);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        
        await MySQL.query(`UPDATE user SET banned = 1 WHERE uuid = '${uuid}';`);
        await MySQL.query(`UPDATE token SET vaild = 0, \`lock\` = 1, expiredTime = UNIX_TIMESTAMP() WHERE uuid = '${uuid}';`);

        const responseData = {
            "message" : "Successfully banned"
        }
        logger.setOutput(responseData);
        const log = logger.success();
        res.send(log);
        return;
    }
    catch(e) {
        logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
        logger.setErrorStack(e);
        const log = logger.error(true);
        res.status(500).send(log);
        return;
    }
});

module.exports = router;