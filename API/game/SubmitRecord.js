const { StringUtils, MySQL, Logger } = require('../../Utils');
const { ErrorCodes } = require('../../codes');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("submitRecord", req.body);
    const { secure, _300x, _300, _100x, _100, _50, miss, score, acc, mapHash, time, uuid, modList, rank, maxCombo } = req.body;

    if (!secure || !_300x || !_300 || !_100x || !_100 || !_50 || !miss || !score || !acc || !mapHash || !time || !uuid || !modList || !rank || !maxCombo) {
        res.status(403).send(`Invalid Query`);
        logger.setErrorCode(ErrorCodes.INVALID_QUERY);
        logger.error(false);
        return;
    }

    const check = StringUtils.getSecureString(_300x, _300, _100x, _100, _50, miss, score, acc, mapHash, time, modList, rank, maxCombo);

    if (secure != check) {
        res.status(403).send(`Invalid Secure`);
        logger.setErrorCode(ErrorCodes.INVALID_SECURE);
        logger.error(false);
        return;
    }

    try {
        const result = await MySQL.query(`SELECT id, played FROM results WHERE uuid = "${uuid}" AND played = 0 AND map_hash = "${mapHash}";`);
        if (result.length != 0) {
            const played = result[0]["played"];
            if (played == 1) {
                logger.setErrorCode(ErrorCodes.EXPIRED_PLAYID);
                const log = logger.error();
                res.send(log);
                return;
            }
            await MySQL.query(`UPDATE results SET \`300x\` = ${_300x}, \`300\` = ${_300}, \`100x\` = ${_100x}, \`100\` = ${_100}, \`50\` = ${_50}, \`miss\` = ${miss}, \`score\` = ${score}, \`acc\` = "${acc}", \`submitTime\` = ${time}, \`mod_list\` = "${modList}", \`rank\` = "${rank}", maxCombo = ${maxCombo}, \`played\` = 1 WHERE id = "${result[0]["id"]}";`);
            let responseData = {
                "message": "Successfully submitted the score."
            }
            logger.setOutput(responseData);
            const log = logger.success();
            res.send(log);
            return;
        }
        else {
            logger.setErrorCode(ErrorCodes.PLAYID_NOT_FOUND);
            const log = logger.error();
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