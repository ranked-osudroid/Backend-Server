const { MySQL, Logger } = require('../../../Utils');
const { ErrorCodes } = require('../../../logger/codes');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("recentRecord", req.body);
    const { key, name } = req.body;

    if (!key || !name) {
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
        const checkExist = await MySQL.query(`SELECT uuid FROM user WHERE name = "${name}";`);
        if (checkExist.length == 0) {
            logger.setErrorCode(ErrorCodes.USER_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        const uuid = checkExist[0]["uuid"];
        const recentRecord = await MySQL.query(`SELECT * FROM results WHERE uuid = '${uuid}' AND played = 1 ORDER BY submitTime DESC;`);
        if (recentRecord.length == 0) {
            logger.setErrorCode(ErrorCodes.PLAYER_NO_RECORDS);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        const id = recentRecord[0]["id"];
        const mapId = recentRecord[0]["map_id"];
        const mapSetId = recentRecord[0]["mapset_id"];
        const mapHash = recentRecord[0]["map_hash"];
        const _300x = recentRecord[0]["300x"];
        const _300 = recentRecord[0]["300"];
        const _100x = recentRecord[0]["100x"];
        const _100 = recentRecord[0]["100"];
        const _50 = recentRecord[0]["50"];
        const miss = recentRecord[0]["miss"];
        const score = recentRecord[0]["score"];
        const acc = recentRecord[0]["acc"];
        const rank = recentRecord[0]["rank"];
        const modList = recentRecord[0]["mod_list"];
        const maxCombo = recentRecord[0]["maxCombo"];
        const submitTime = recentRecord[0]["submitTime"];
        const createdTime = recentRecord[0]["createdTime"];
        let responseData = {
            "id": id,
            "mapId": mapId,
            "mapSetId": mapSetId,
            "mapHash": mapHash,
            "300x": _300x,
            "300": _300,
            "100x": _100x,
            "100": _100,
            "50": _50,
            "miss": miss,
            "score": score,
            "acc": acc,
            "rank": rank,
            "modList": modList,
            "maxCombo" : maxCombo,
            "submitTime": submitTime,
            "createdTime": createdTime,
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