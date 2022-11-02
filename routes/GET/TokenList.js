import Logger from '#logger';
import { RouterUtils } from '#utils';
import { Tokens } from '#schemas';
import { ErrorCodes } from '#codes';

import * as express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    const logger = new Logger("TokenList", req.body);
    try {
        if(!RouterUtils.isValidQuery(req.body, "id")) {
            RouterUtils.invalidQuery(res, logger);
            return;
        }

        const { id } = req.query;

        const log = await Tokens.find({
            id: id
        });

        if(log.length == 0) {
            RouterUtils.fail(res, logger, ErrorCodes.TOKEN_LIST_INVALID);
            return;
        }

        RouterUtils.success(res, logger, log);
    }
    catch (e) {
        RouterUtils.internalError(res, logger, e);
        return;
    }
});

export default router;