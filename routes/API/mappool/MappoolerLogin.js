import { ErrorCodes } from '#codes';
import { MySQL } from '#database';
import Logger from '#logger';
import { RouterUtils, StringUtils } from '#utils';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("mappoolerLogin", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "token")) {
        RouterUtils.invalidQuery(res, logger);
        return;
    }

    const { token, key } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const checkToken = await MySQL.query(`SELECT uuid, vaild, \`lock\` FROM token WHERE md5 = "${StringUtils.getSecureString(token)}";`);
        if (checkToken.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_NOT_EXIST);
            return;
        }
        if (checkToken[0]["lock"] == 1) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_LOCKED);
            return;
        }
        if (checkToken[0]["vaild"] == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_EXPIRED);
            return;
        }
        const userInfo = await MySQL.query(`SELECT name, mappooler FROM user WHERE uuid = "${checkToken[0]["uuid"]}";`);
        let responseData = {
            "uuid": checkToken[0]["uuid"],
            "name": userInfo[0]["name"],
            "mappooler" : userInfo[0]["mappooler"]
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