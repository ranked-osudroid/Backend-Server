import { StringUtils, Utils, RouterUtils } from '#utils';
import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("register", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "discord_id", "uid", "name", "rank", "profile")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, discord_id, uid, name, rank, profile } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const check = await MySQL.query('SELECT discord_id FROM user WHERE discord_id = ?', discord_id);
        if (check.length == 0) {
            let uuid = StringUtils.getRandomUuid();
            while (true) {
                const uuidCheck = await MySQL.query('SELECT uuid FROM user WHERE uuid = ?', uuid);
                if (uuidCheck.length == 0) {
                    break;
                }
                else {
                    uuid = StringUtils.getRandomUuid();
                    continue;
                }
            }
            const elo = Utils.getInitialElo(rank);
            await MySQL.query('INSERT INTO `user`(discord_id, o_uid, uuid, name, verified_time, mappooler, profile, staff) VALUES(?, ?, ?, ?, UNIX_TIMESTAMP(), 0, ?, 0)', discord_id, uid, uuid, name, profile);
            await MySQL.query('INSERT INRO elo(uuid, elo, win, draw, lose) VALUES(?, ?, 0, 0, 0)', uuid, elo);
            let responseData = {
                "message": "Successfully registered the user."
            }
            RouterUtils.success(res, logger, responseData);
            return;

        }
        else {
            RouterUtils.fail(res, logger, ErrorCodes.ALREADY_REGISTERED);
            return;
        }
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;