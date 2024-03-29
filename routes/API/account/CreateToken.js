import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { RouterUtils, StringUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("createToken", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "uuid")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { key, uuid } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const userCheck = await MySQL.query('SELECT uuid FROM user WHERE uuid = ?', uuid);
        if (userCheck.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.USER_NOT_EXIST);
            return;
        }
        const validId = await MySQL.query('SELECT md5 FROM token WHERE uuid = ? AND vaild = 1', uuid);
        for (let i = 0; i < validId.length; i++) {
            await MySQL.query('UPDATE token SET vaild = 0, expiredTime = UNIX_TIMESTAMP() WHERE md5 = ?', validId[i]["md5"]);
        }
        while (true) {
            const id = StringUtils.getAlphaNumericString(7);
            const idCheck = await MySQL.query('SELECT md5 FROM token WHERE md5 = ?', StringUtils.getSecureString(id));
            if (idCheck.length != 0) {
                continue;
            }
            await MySQL.query('INSERT INTO token(uuid, md5, createdTime) VALUES (?, ?, UNIX_TIMESTAMP())', uuid, StringUtils.getSecureString(id));
            let responseData = {
                "id": id,
            }
            RouterUtils.success(res, logger, responseData);
            return;
        }
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;