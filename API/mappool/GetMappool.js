const { ErrorCodes } = require('../../codes');
const { Logger, MySQL } = require('../../Utils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("getMappool", req.body);
    const { key, uuid } = req.body;

    if (!key || !uuid) {
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
        const checkMAppool = await MySQL.query(`SELECT uuid FROM mappool WHERE uuid = "${uuid}";`);
        if (checkMAppool.length == 0) {
            res.status(403).send(`Mappool does not exist`);
            logger.setErrorCode(ErrorCodes.MAPPOOL_NOT_EXIST);
            logger.error(false);
            return;
        }
        const maps = await MySQL.query(`SELECT * FROM maps WHERE inheritanceUUID = "${uuid}";`);
        let responseData = {
            "maps" : maps
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