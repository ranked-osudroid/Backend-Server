const { ErrorCodes } = require('../../../logger/codes');
const { Logger, MySQL } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("expirePlayId", req.body);
    const { key, playId } = req.body;

    if (!key || !playId) {
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
        
        const search = await MySQL.query(`SELECT id FROM results WHERE id = '${playId}' AND played = 0;`);

        if(search.length == 0) {
            logger.setErrorCode(ErrorCodes.EXPIRED_PLAYID);
            const log = logger.error(false);
            res.send(log);
            return;
        }

        MySQL.query(`UPDATE results SET \`300x\` = 0, \`300\` = 0, \`100x\` = 0, \`100\` = 0, \`50\` = 0, \`miss\` = 0, \`score\` = 0, \`acc\` = 0, \`rank\` = 'D', \`mod_list\` = 'None', maxCombo = 0, submitTime = UNIX_TIMESTAMP(), played = 1 WHERE id = '${playId}';`);

        let responseData = {
            "playId": playId
        }
        logger.setOutput(responseData);
        const log = logger.success();
        res.send(log);
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