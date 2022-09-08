import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { RouterUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("ProfileUpdate", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "discordId")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, discordId, profileId, name, staff, mappooler } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        let sql = 'UPDATE user SET ';
        let wildCards = [];

        if(profileId) {
            sql += 'profile = ?,';
            wildCards.push(profileId);
        }
        if(name) {
            sql += 'name = ?,';
            wildCards.push(name);
        }
        if(staff) {
            sql += 'staff = ?,';
            wildCards.push(Boolean(staff));
        }
        if(mappooler) {
            sql += 'mappooler = ?,';
            wildCards.push(Boolean(mappooler));
        }

        sql = sql.substring(0, sql.length - 1);

        if(sql == 'UPDATE user SET' || wildCards == []) {
            RouterUtils.fail(res, logger, ErrorCodes.PROFILE_NO_CHANGE);
            return;
        }

        wildCards.push(discordId);
        await MySQL.query(sql + ' WHERE discord_id = ?', wildCards);

        const responseData = {
            "message": "Successfully changed profile."
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