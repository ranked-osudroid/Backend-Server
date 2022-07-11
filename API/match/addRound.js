const { ErrorCodes } = require('../../codes');
const { Logger, MySQL, Utils } = require('../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("addRound", req.body);
    const { key, draw, startedTime, matchId, mapid, mapsetid, mapset, bluePlayID, redPlayID  } = req.body;

    if (!key || !draw || !startedTime || !matchId || !mapid || !mapsetid || !mapset || !bluePlayID || !redPlayID) {
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
        const findMatch = await MySQL.query(`SELECT * FROM matches WHERE match_id = '${matchId}';`);

        if(findMatch.length == 0) {
            logger.setErrorCode(ErrorCodes.MATCH_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        if(findMatch[0]["ended_time"] != -1 || findMatch[0]["aborted"] == 1) {
            logger.setErrorCode(ErrorCodes.MATCH_ALREADY_END);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        const findPlayIDs = await MySQL.query(`SELECT id FROM results WHERE id = '${bluePlayID}' OR id = '${redPlayID}';`);

        if(findPlayIDs.length < 2) {
            logger.setErrorCode(ErrorCodes.PLAYID_NOT_FOUND);
            const log = logger.error(false);
            res.send(log);
            return;
        }
 
        const { blue_uuid, red_uuid, blue_score, red_score } = findMatch[0];
     
        await MySQL.query(`INSERT INTO rounds(match_id, started_time, mapsetid, mapid, mapset, bluePlayID, redPlayID) VALUES('${matchId}', ${startedTime}, ${mapsetid}, ${mapid}, ${mapset}, '${bluePlayID}', '${redPlayID}');`);

        const uuid1Stats = await MySQL.query(`SELECT * FROM elo WHERE uuid = '${blue_uuid}';`);
        const uuid2Stats = await MySQL.query(`SELECT * FROM elo WHERE uuid = '${red_uuid}';`);

        let responseData = {
            "blueScore" : blue_score,
            "redScore" : red_score
        };

        switch(Number(draw)) {
            case 0:
                //draw
                MySQL.query(`UPDATE matches SET blue_score = ${blue_score + 1}, red_score = ${red_score + 1} WHERE match_id = '${matchId}';`);
                responseData["blueScore"]++;
                responseData["redScore"]++;
                break;
            case 1:
                //blue win
                MySQL.query(`UPDATE elo SET ${Utils.intToMod(mapset)}_win = ${uuid1Stats[0][Utils.intToMod(mapset) + "_win"] + 1} WHERE uuid = '${blue_uuid}';`);
                MySQL.query(`UPDATE elo SET ${Utils.intToMod(mapset)}_lose = ${uuid2Stats[0][Utils.intToMod(mapset) + "_lose"] + 1} WHERE uuid = '${red_uuid}';`);
                MySQL.query(`UPDATE matches SET blue_score = ${blue_score + 1} WHERE match_id = '${matchId}';`);
                responseData["blueScore"]++;
                break;
            case -1:
                //red win
                MySQL.query(`UPDATE elo SET ${Utils.intToMod(mapset)}_win = ${uuid2Stats[0][Utils.intToMod(mapset) + "_win"] + 1} WHERE uuid = '${red_uuid}}';`);
                MySQL.query(`UPDATE elo SET ${Utils.intToMod(mapset)}_lose = ${uuid1Stats[0][Utils.intToMod(mapset) + "_lose"] + 1} WHERE uuid = '${blue_uuid}';`);
                MySQL.query(`UPDATE matches SET red_score = ${red_score + 1} WHERE match_id = '${matchId}';`);
                responseData["redScore"]++;
                break;
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