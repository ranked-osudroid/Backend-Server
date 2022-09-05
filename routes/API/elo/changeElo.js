import { ErrorCodes } from '#codes';
import Logger from '#logger';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("changeElo", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "draw", "uuid1", "uuid2", "elo1", "elo2")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, draw, uuid1, uuid2, elo1, elo2 } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const checkUsers = await MySQL.query(`SELECT uuid FROM user WHERE uuid = "${uuid1}" OR uuid = "${uuid2}";`);
        if(checkUsers.length < 2) {
            RouterUtils.fail(ErrorCodes.USER_NOT_EXIST);
            return;
        }
        const uuid1Elo = await MySQL.query(`SELECT * FROM elo WHERE uuid = "${uuid1}";`);
        const uuid2Elo = await MySQL.query(`SELECT * FROM elo WHERE uuid = "${uuid2}";`);
        if(draw == 1) {
            let uuid1Draw = uuid1Elo[0]["draw"] + 1;
            let uuid2Draw = uuid2Elo[0]["draw"] + 1;
            await MySQL.query(`UPDATE elo SET draw = ${uuid1Draw}, elo = ${elo1} WHERE uuid = "${uuid1}";`);
            await MySQL.query(`UPDATE elo SET draw = ${uuid2Draw}, elo = ${elo2} WHERE uuid = "${uuid2}";`);
        }
        else {
            let uuid1Win = uuid1Elo[0]["win"] + 1;
            let uuid2Lose = uuid2Elo[0]["lose"] + 1;
            await MySQL.query(`UPDATE elo SET win = ${uuid1Win}, elo = ${elo1} WHERE uuid = "${uuid1}";`);
            await MySQL.query(`UPDATE elo SET lose = ${uuid2Lose}, elo = ${elo2} WHERE uuid = "${uuid2}";`);
        }
        let responseData = {
            "message" : "Successfully edited.",
            "uuid1Deviation" : `${Number(elo1) - Number(uuid1Elo[0]["elo"])}`,
            "uuid2Deviation" : `${Number(elo2) - Number(uuid2Elo[0]["elo"])}`
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