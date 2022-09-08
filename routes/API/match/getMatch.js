import { RouterUtils, Utils } from '#utils';
import Logger from '#logger';
import { MySQL } from '#database';
import { ErrorCodes } from '#codes';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("getMatch", req.body);

    if (!RouterUtils.isValidQuery(req.body, "key", "matchId")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, matchId } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }
    
    try {
        const findMatch = await MySQL.query('SELECT * FROM matches WHERE match_id = ?', matchId);

        if(findMatch.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_NOT_EXIST);
            return;
        }

        if(findMatch[0]["ended_time"] == -1) {
            RouterUtils.fail(res, logger, ErrorCodes.MATCH_NOT_END);
            return;
        }

        const blueInfo = await MySQL.query('SELECT name FROM user WHERE uuid = ?', match["blueUUID"]);
        const redInfo = await MySQL.query('SELECT name FROM user WHERE uuid = ?', match["redUUID"]);

        const match = {
            "id" : matchId,
            "startedTime" : findMatch[0]["start_time"],
            "endedTime" : findMatch[0]["ended_time"],
            "blueUUID" : findMatch[0]["blue_uuid"],
            "redUUID" : findMatch[0]["red_uuid"],
            "blueName" : blueInfo[0]["name"],
            "redName" : redInfo[0]["name"],
            "blueScore" : findMatch[0]["blue_score"],
            "redScore" : findMatch[0]["red_score"],
            "mappool" : findMatch[0]["mappool_uuid"],
            "aborted" : findMatch[0]["aborted"],
            "rounds" : []
        };

        const findRounds = await MySQL.query('SELECT * FROM rounds WHERE match_id = ? ORDER BY started_time ASC', matchId);

        for(let i = 0; i < findRounds.length; i++) {
            const findRound = findRounds[i];
            const round = {
                "startedTime" : findRound["started_time"],
                "mapid" : findRound["mapid"],
                "mapset" : findRound["mapset"],
                "bluePlayResult" : {},
                "redPlayResult" : {}
            };

            const mapset = findRound["mapset"];

            const bluePlayId = await MySQL.query('SELECT \`300\`, \`100\`, \`50\`, \`miss\`, \`score\`, \`acc\`, \`rank\`, \`mod_list\`, \`maxCombo\` FROM results WHERE id = ?;', findRound["bluePlayID"]);
            const redPlayId = await MySQL.query('SELECT \`300\`, \`100\`, \`50\`, \`miss\`, \`score\`, \`acc\`, \`rank\`, \`mod_list\`, \`maxCombo\` FROM results WHERE id = ?;', findRound["redPlayID"]);

            if(mapset == 0) {
                // mapset is None
                if(bluePlayId[0]["mod_list"] == "PR" || bluePlayId[0]["mod_list"].replace(/pr/gi, "").match(Utils.checkRegToMapset(mapset)).length == (bluePlayId[0]["mod_list"].length / 4)) {
                    round["bluePlayResult"] = bluePlayId[0];
                }
                else {
                    round["bluePlayResult"] = {
                        "300" : 0,
                        "100" : 0,
                        "50" : 0,
                        "miss" : 0,
                        "score" : 0,
                        "acc" : "0.00%",
                        "rank" : "D",
                        "modList" : "None",
                        "maxCombo" : 0
                    };
                }

                if(redPlayId[0]["mod_list"] == "PR" || redPlayId[0]["mod_list"].replace(/pr/gi, "").match(Utils.checkRegToMapset(mapset)).length == (redPlayId[0]["mod_list"].length / 4)) {
                    round["redPlayResult"] = redPlayId[0];
                }
                else {
                    round["redPlayResult"] = {
                        "300" : 0,
                        "100" : 0,
                        "50" : 0,
                        "miss" : 0,
                        "score" : 0,
                        "acc" : "0.00%",
                        "rank" : "D",
                        "modList" : "None",
                        "maxCombo" : 0
                    };
                }
            }
            else {
                // mapset is not none

                // ex)
                // "HRHD".match(/hr|hd/gi) => ["HR", "HD"]
                // "HRHD".length => 4, 4 / 2 => 2 --\
                // ["HR", "HD"].length == 2 <-------/
                // This means they played correct mods
                //
                // "HDDT".match(/dt/gi) => ["DT"]
                // "HDDT".length => 4, 4 / 2 => 2 -\
                // ["DT"].length != 2 <------------/
                // This means they played wrong mods
                if((mapset == 4 && (bluePlayId[0]["modList"] == "None" || bluePlayId[0]["modList"] == "PR")) || bluePlayId[0]["mod_list"].replace(/pr/gi, "").match(Utils.checkRegToMapset(mapset)).length == bluePlayId[0]["mod_list"].length / 2) {
                    round["bluePlayResult"] = bluePlayId[0];
                }
                else {
                    round["bluePlayResult"] = {
                        "300" : 0,
                        "100" : 0,
                        "50" : 0,
                        "miss" : 0,
                        "score" : 0,
                        "acc" : "0.00%",
                        "rank" : "D",
                        "modList" : "None",
                        "maxCombo" : 0
                    };
                }

                if((mapset == 4 && (redPlayId[0]["modList"] == "None" || redPlayId[0]["modList"] == "PR")) || redPlayId[0]["mod_list"].replace(/pr/gi, "").match(Utils.checkRegToMapset(mapset)).length == redPlayId[0]["mod_list"].length / 2) {
                    round["redPlayResult"] = redPlayId[0];
                }
                else {
                    round["redPlayResult"] = {
                        "300" : 0,
                        "100" : 0,
                        "50" : 0,
                        "miss" : 0,
                        "score" : 0,
                        "acc" : "0.00%",
                        "rank" : "D",
                        "modList" : "None",
                        "maxCombo" : 0
                    };
                }
            }
            match["rounds"].push(round);
        }

        RouterUtils.success(res, logger, match);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;