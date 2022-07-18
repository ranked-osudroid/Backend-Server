const { ErrorCodes } = require('../../../logger/codes');
const { Logger, MySQL, Utils } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("getMatch", req.body);
    const { key, matchId  } = req.body;

    if (!key || !matchId) {
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

        let match = {
            "id" : "",
            "startedTime" : "",
            "endedTime" : "",
            "blueUUID" : "",
            "redUUID" : "",
            "blueName" : "",
            "redName" : "",
            "blueScore" : "",
            "redScore" : "",
            "mappool" : "",
            "aborted" : "",
            "rounds" : [

            ]
        }
        const findMatch = await MySQL.query(`SELECT * FROM matches WHERE match_id = '${matchId}';`);

        if(findMatch.length == 0) {
            logger.setErrorCode(ErrorCodes.MATCH_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        if(findMatch[0]["ended_time"] == -1) {
            logger.setErrorCode(ErrorCodes.MATCH_NOT_END);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        match["id"] = matchId;
        match["startedTime"] = findMatch[0]["start_time"];
        match["endedTime"] = findMatch[0]["ended_time"];
        match["blueUUID"] = findMatch[0]["blue_uuid"];
        match["redUUID"] = findMatch[0]["red_uuid"];
        match["blueScore"] = findMatch[0]["blue_score"];
        match["redScore"] = findMatch[0]["red_score"];
        match["mappool"] = findMatch[0]["mappool_uuid"];
        match["aborted"] = findMatch[0]["aborted"];

        const blueInfo = await MySQL.query(`SELECT name FROM user WHERE uuid = '${match["blueUUID"]}';`);
        const redInfo = await MySQL.query(`SELECT name FROM user WHERE uuid = '${match["redUUID"]}';`);

        match["blueName"] = blueInfo[0]["name"];
        match["redName"] = redInfo[0]["name"];

        const findRounds = await MySQL.query(`SELECT * FROM rounds WHERE match_id = '${matchId}' ORDER BY started_time ASC;`);

        for(let i = 0; i < findRounds.length; i++) {
            let round = {
                "startedTime" : "",
                "mapid" : "",
                "mapset" : "",
                "bluePlayResult" : {},
                "redPlayResult" : {}
            };

            const findRound = findRounds[i];
            round["startedTime"] = findRound["started_time"];
            round["mapid"] = findRound["mapid"];
            round["mapset"] = findRound["mapset"];

            const mapset = findRound["mapset"];

            const bluePlayId = await MySQL.query(`SELECT \`300\`, \`100\`, \`50\`, \`miss\`, \`score\`, \`acc\`, \`rank\`, \`mod_list\`, \`maxCombo\` FROM results WHERE id = '${findRound["bluePlayID"]}';`);
            const redPlayId = await MySQL.query(`SELECT \`300\`, \`100\`, \`50\`, \`miss\`, \`score\`, \`acc\`, \`rank\`, \`mod_list\`, \`maxCombo\` FROM results WHERE id = '${findRound["redPlayID"]}';`);

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

        logger.setOutput(match);
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