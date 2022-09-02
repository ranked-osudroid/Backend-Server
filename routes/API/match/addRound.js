import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { RouterUtils, Utils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("addRound", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "draw", "startedTime", "matchId", "mapid", "mapsetid", "mapset", "bluePlayID", "redPlayID")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, draw, startedTime, matchId, mapid, mapsetid, mapset, bluePlayID, redPlayID  } = req.body;

    if(key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const findMatch = await MySQL.query(`SELECT * FROM matches WHERE match_id = '${matchId}';`);

        if(findMatch.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_NOT_EXIST);
            return;
        }
        if(findMatch[0]["ended_time"] != -1 || findMatch[0]["aborted"] == 1) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_ALREADY_END);
            return;
        }

        const findPlayIDs = await MySQL.query(`SELECT id FROM results WHERE id = '${bluePlayID}' OR id = '${redPlayID}';`);

        if(findPlayIDs.length < 2) {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYID_NOT_FOUND);
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
        RouterUtils.success(res, logger, responseData);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;