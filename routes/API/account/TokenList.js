import { MySQL } from '#database';
import Logger from '#logger';
import { ErrorCodes } from '#codes';
import { RouterUtils, StringUtils, Utils } from '#utils';
import { Tokens } from '#schemas';

import * as express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const logger = new Logger("TokenList", req.body);

    if(!RouterUtils.isValidQuery(req.body, "key", "uuid")) {
        RouterUtils.invalidQuery(res, logger);
    }

    const { key, uuid } = req.body;

    if (key != process.env.KEY) {
        RouterUtils.invalidKey(res, logger);
        return;
    }

    try {
        const deviceIDList = await MySQL.query(`SELECT deviceID FROM token WHERE uuid = '${uuid}';`);
        if (deviceIDList.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYER_NO_TOKENS);
            return;
        }
        let sql = `SELECT uuid, md5, vaild, \`lock\`, createdTime, expiredTime FROM token WHERE uuid = '${uuid}'`;
        for (let i = 0; i < deviceIDList.length; i++) {
            sql += ` OR deviceID = '${deviceIDList[i]["deviceID"]}'`;
        }
        sql += ';';
        const tokenList = await MySQL.query(sql);
        const time = Utils.getUnixTime();
        while(true) {
            let id = StringUtils.getAlphaNumericString(7);
            try {
                await Tokens.create({
                    id: id,
                    createdTime: time,
                    tokens: tokenList
                });
                const responseData = {
                    "id": id
                }
                RouterUtils.success(res, logger, responseData);
                return;
            }
            catch(e) {

            }
        }
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

module.exports = router;