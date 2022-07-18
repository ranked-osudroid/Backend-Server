const { ErrorCodes } = require('../../../logger/codes');
const { StringUtils, Logger, MySQL } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createMatch", req.body);
    const { key, uuid1, uuid2, mappoolUUID } = req.body;
    let matchId = StringUtils.getAlphaNumericString(7);

    if (!key || !uuid1 || !uuid2) {
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
        while (true) {
            const query = await MySQL.query(`SELECT match_id FROM matches WHERE match_id = "${matchId}";`);
            if (query.length == 0) {
                break;
            }
            matchId = StringUtils.getAlphaNumericString(7);
        }

        let mappool = "";

        if(mappoolUUID == undefined) {
            const blueInfo = await MySQL.query(`SELECT uuid, elo FROM elo WHERE uuid = "${uuid1}";`);
            const redInfo = await MySQL.query(`SELECT uuid, elo FROM elo WHERE uuid = "${uuid2}";`);
            const blueElo = blueInfo[0]["elo"];
            const redElo = redInfo[0]["elo"];
            const averageElo = (Number(blueElo) + Number(redElo)) / 2
            let sql = `SELECT * FROM mappool WHERE averageMMR BETWEEN "${averageElo - 200}" AND "${averageElo + 200}";`;
            const mappools = await MySQL.query(sql);
            const random = Math.floor(Math.random() * mappools.length);
            mappool = mappools[random]["uuid"];
        }
        else {
            mappool = mappoolUUID;
        }
        
        await MySQL.query(`INSERT INTO matches(match_id, start_time, ended_time, blue_uuid, red_uuid, blue_score, red_score, mappool_uuid, aborted) VALUES("${matchId}", UNIX_TIMESTAMP(), -1, "${uuid1}", "${uuid2}", 0, 0, "${mappool}", 0);`);
        let responseData = {
            "matchId" : matchId,
            "mappool" : mappool
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