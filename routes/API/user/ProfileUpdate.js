const { MySQL } = require('@database');
const { Logger } = require('@logger');
const { ErrorCodes } = require('@logger/codes');
const { RouterUtils } = require('@utils');

const express = require('express');
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
        let sql = `UPDATE user SET `;

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
            RouterUtils.fail(res, logger, ErrorCodes.PROFILE_NO_CHANGE);
            return;
        }

        await MySQL.query(sql);

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

module.exports = router;