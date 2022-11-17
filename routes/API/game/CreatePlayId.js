import { ErrorCodes } from '#codes';
import { RouterUtils, StringUtils, Request } from '#utils';
import Logger from '#logger';
import { MySQL } from '#database';
import { Records } from '#schemas';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createPlayId", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "uuid", "mapid")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, uuid, mapid } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        let mapHash, mapName, mapsetid;

        let playId = StringUtils.getAlphaNumericString(7);

        while (true) {
            // const query = await MySQL.query('SELECT id FROM results WHERE id = ?', playId);
            // if (query.length == 0) {
            //     break;
            // }
            // playId = StringUtils.getAlphaNumericString(7);
            const query = await Records.findOne({
                id : playId
            });
            console.log(`${playId} : ${query}`);
            if(query == null) {
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
            RouterUtils.fail(res, logger, ErrorCodes.MAP_NOT_EXIST);
            return;
        }

        Records.create({
            id: playId,
            uuid: uuid,
            mapId: mapid,
            mapSetId: mapsetid,
            mapHash: mapHash
        });

        // await MySQL.query('INSERT INTO results(id, uuid, map_id, mapset_id, map_hash, createdTime) VALUES(?, ?, ?, ?, ?, UNIX_TIMESTAMP())', playId, uuid, mapid, mapsetid, mapHash);
        
        let responseData = {
            "playId": playId,
            "mapHash": mapHash,
            "mapName": mapName
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