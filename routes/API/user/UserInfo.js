import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("userInfo", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key") ||
        (!RouterUtils.isValidQuery(req.body, "uuid")
        && !RouterUtils.isValidQuery(req.body, "discordid")
        && !RouterUtils.isValidQuery(req.body, "username"))) {
            RouterUtils.invalidQuery(res, logger);
            return;
    }

    const { key, uuid, discordid, username } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const search = await MySQL.query(`SELECT * FROM user WHERE uuid = ? OR discord_id = ? OR name = ?`, uuid, discordid, username);

        if (search.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.USER_NOT_EXIST);
            return;
        }
        const UUID = search[0]["uuid"];
        const discordId = search[0]["discord_id"];
        const { o_uid, name, verified_time, banned, mappooler, profile, staff } = search[0];

        const eloSearch = await MySQL.query('SELECT * FROM elo WHERE uuid = ?', UUID);
        const { elo, win, draw, lose } = eloSearch[0];

        const tokenSearch = await MySQL.query('SELECT COUNT(uuid) as \'count\' FROM token WHERE uuid = ? AND vaild = 1', UUID);

        let responseData = {
            "uuid": UUID,
            "discordId": discordId,
            "o_uid": o_uid,
            "name": name,
            "elo": elo,
            "win": win,
            "draw": draw,
            "lose": lose,
            "verified_time": verified_time,
            "banned": banned * 1,
            "mappooler": mappooler * 1,
            "profile": profile,
            "staff": staff * 1,
            "hasToken" : tokenSearch[0]["count"] * 1
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