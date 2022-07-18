const { ErrorCodes } = require('../../../logger/codes');
const { StringUtils, Logger, MySQL, Request } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createPlayId", req.body);
    const { key, uuid, mapid } = req.body;
    let mapHash, mapName, mapsetid;
    let playId = StringUtils.getAlphaNumericString(7);

    if (!key || !uuid || !mapid) {
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
            const query = await MySQL.query(`SELECT id FROM results WHERE id = "${playId}";`);
            if (query.length == 0) {
                break;
            }
            playId = StringUtils.getAlphaNumericString(7);
        }
        const osuRequest = new Request(`https://osu.ppy.sh/api/get_beatmaps?k=${process.env.OSU_KEY}&b=${mapid}`);
        const osuapi = await osuRequest.sendRequest();
        for (let i = 0; i < osuapi.length; i++) {
            if (osuapi[i]["beatmap_id"] == mapid) {
                mapHash = osuapi[i]["file_md5"];
                mapName = osuapi[i]["artist"] + " - " + osuapi[i]["title"] + " (" + osuapi[i]["creator"] + ")" + " [" + osuapi[i]["version"] + "]";
                mapsetid = osuapi[i]["beatmapset_id"];
                break;
            }
        }
        if (mapHash === undefined) {
            logger.setErrorCode(ErrorCodes.MAP_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        const sql = `INSERT INTO results(id, uuid, map_id, mapset_id, map_hash, createdTime) VALUES ("${playId}", "${uuid}", "${mapid}", "${mapsetid}", "${mapHash}", UNIX_TIMESTAMP())`;
        await MySQL.query(sql);
        let responseData = {
            "playId": playId,
            "mapHash": mapHash,
            "mapName": mapName
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