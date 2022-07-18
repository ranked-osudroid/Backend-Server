const { ErrorCodes } = require('../../../logger/codes');
const { Logger, MySQL } = require('../../../Utils');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const logger = new Logger("getMappool", req.body);

    try {
        const checkMappool = await MySQL.query(`SELECT * FROM mappool;`);
        res.send(checkMappool);
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