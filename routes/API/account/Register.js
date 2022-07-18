const { ErrorCodes } = require('../../../logger/codes');
const { MySQL, StringUtils, Logger, Utils } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("register", req.body);
    const { key, discord_id, uid, name, rank, profile } = req.body;

    if (!key || !discord_id || !uid || !name || !rank || !profile) {
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
        const check = await MySQL.query(`SELECT discord_id FROM user WHERE discord_id = "${discord_id}";`);
        if (check.length == 0) {
            let uuid = StringUtils.getRandomUuid();
            while (-1) {
                const uuidCheck = await MySQL.query(`SELECT uuid FROM user WHERE uuid = "${uuid}";`);
                if (uuidCheck.length == 0) {
                    break;
                }
                else {
                    uuid = StringUtils.getRandomUuid();
                    continue;
                }
            }
            const elo = Utils.getInitialElo(rank);
            await MySQL.query(`INSERT INTO \`user\`(\`discord_id\`, \`o_uid\`, \`uuid\`, \`name\`, \`verified_time\`, \`mappooler\`, \`profile\`, \`staff\`) VALUES ("${discord_id}", "${uid}", "${uuid}", "${name}", UNIX_TIMESTAMP(), 0, '${profile}', 0);`);
            await MySQL.query(`INSERT INTO elo(uuid, elo, win, draw, lose) VALUES("${uuid}", ${elo}, 0, 0, 0);`);
            let responseData = {
                "message": "Successfully registered the user."
            }
            logger.setOutput(responseData);
            const log = logger.success();
            res.send(log);
            return;

        }
        else {
            logger.setErrorCode(ErrorCodes.ALREADY_REGISTERED);
            const log = logger.error(false);
            res.send(log);
            return;
        }
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