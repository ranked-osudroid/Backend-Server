const { ErrorCodes } = require('../../../logger/codes');
const { Logger, MySQL, Utils } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("endMatch", req.body);
    const { key, matchId, aborted } = req.body;

    if (!key || !matchId || !aborted) {
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
        const searchMatch = await MySQL.query(`SELECT * FROM matches WHERE match_id = '${matchId}';`);
        if(searchMatch.length == 0) {
            logger.setErrorCode(ErrorCodes.MATCH_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        if(searchMatch[0]["ended_time"] != -1) {
            logger.setErrorCode(ErrorCodes.MATCH_ALREADY_END);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        const unixTime = Utils.getUnixTime();

        if(aborted == 1) {
            
            await MySQL.query(`UPDATE matches SET aborted = 1, ended_time = ${unixTime} WHERE match_id = '${matchId}';`);
            let responseData = {
                "aborted" : 1,
                "endedTime" : unixTime
            }
            logger.setOutput(responseData);
            const log = logger.success();
            res.send(log);
            return;
        }

        await MySQL.query(`UPDATE matches SET ended_time = ${unixTime} WHERE match_id = '${matchId}';`);
        let responseData = {
            "aborted" : 0,
            "endedTime" : unixTime
        }
        logger.setOutput(responseData);
        const log = logger.success();
        res.send(log);
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