const { MySQL, Logger } = require('../../Utils');
const { ErrorCodes } = require('../../codes');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("ProfileUpdate", req.body);
    const { key, discordId, profileId, name, staff, mappooler } = req.body;

    if (!key || !discordId) {
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
        let sql = `UPDATE user SET `
        if(profileId) {
            sql += `profile = '${profileId}', `;
        }

        if(name) {
            sql += `name = '${name}', `;
        }

        if(staff) {
            sql += `staff = ${Boolean(staff)}, `;
        }

        if(mappooler) {
            sql += `mappooler = ${Boolean(mappooler)}, `;
        }

        if(sql.endsWith(', ')) {
            sql = sql.substring(0, sql.length - 2);
        }

        sql += ` WHERE discord_id = '${discordId}';`;

        if(sql == `UPDATE user SET  WHERE discord_id = '${discordId}';`) {
            logger.setErrorCode(ErrorCodes.PROFILE_NO_CHANGE);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        MySQL.query(sql);

        const responseData = {
            "message": "Successfully changed profile."
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