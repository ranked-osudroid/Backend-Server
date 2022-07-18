const { MySQL, Logger } = require('../../../Utils');
const { ErrorCodes } = require('../../../logger/codes');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("userInfo", req.body);
    const { key, uuid, discordid, username } = req.body;
    if (!key || !((uuid != undefined) ^ (discordid != undefined) ^ (username != undefined))) {
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

        let query = ``;
        if(uuid != undefined) {
            query = `uuid = '${uuid}';`;
        }
        if(discordid != undefined) {
            query = `discord_id = '${discordid}';`;
        }
        if(username != undefined) {
            query = `name = '${username}';`;
        }

        const search = await MySQL.query(`SELECT * FROM user WHERE ${query}`);

        if (search.length == 0) {
            logger.setErrorCode(ErrorCodes.USER_NOT_EXIST);
            const log = logger.error(false);
            res.send(log);
            return;
        }
        const UUID = search[0]["uuid"];
        const discordId = search[0]["discord_id"];
        const { o_uid, name, verified_time, banned, mappooler, profile, staff } = search[0];

        const eloSearch = await MySQL.query(`SELECT * FROM elo WHERE uuid = "${UUID}";`);
        const { elo, win, draw, lose } = eloSearch[0];

        const tokenSearch = await MySQL.query(`SELECT COUNT(uuid) as 'count' FROM token WHERE uuid = '${UUID}' AND vaild = 1`);

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