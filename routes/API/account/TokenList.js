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
        const deviceIDList = await MySQL.query('SELECT deviceID FROM token WHERE uuid = ?', uuid);
        if (deviceIDList.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.PLAYER_NO_TOKENS);
            return;
        }
        let sql = 'SELECT uuid, md5, vaild, `lock`, createdTime, expiredTime FROM token WHERE uuid = ?'
        let wildCards = [uuid];
        for (let i = 0; i < deviceIDList.length; i++) {
            sql += ' OR deviceID = ?';
            wildCards.push(deviceIDList[i]["deviceID"]);
        }
        const tokenList = await MySQL.query(sql, wildCards);
        const time = Utils.getUnixTime();
        /*
         * 여기에 왜 while(true) 를 붙인걸까?
         * 그 이유는 Mongoose로 create 를 호출하는데, 만약 let id로 생성한 변수가 이미 데이터베이스에
         * 아이디가 존재 하는 경우, Exception을 throw 하기 때문!
         * 그러기 때문에 중복된 id가 안나올때 까지 id를 검색하고 중복이 아니면 데이터를 insert 하는 방식
         */
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

export default router;