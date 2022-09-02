import { RouterUtils, StringUtils } from '#utils';
import Logger from '#logger';
import { MySQL } from '#database';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createMatch", req.body);
    
    if(!RouterUtils.isValidQuery(req.body, "key", "uuid1", "uuid2")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    /*
     * mappoolUUID 가 undefined 가 되도 되는 이유?
     * mappoolUUID 가 undefined 면 서버에서 임의적으로 맵풀을 정하고
     * undefined 가 아니면 듀얼에서 uuid 를 임의적으로 넣어서 원하는
     * 맵풀로 플레이 하는 것
     */

    const { key, uuid1, uuid2, mappoolUUID } = req.body;
    let matchId = StringUtils.getAlphaNumericString(7);

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
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
        RouterUtils.success(res, logger, responseData);
        return;
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;