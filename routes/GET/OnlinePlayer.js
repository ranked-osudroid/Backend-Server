import Logger from '#logger';
import { RouterUtils } from '#utils';
import { UserConnection } from '#socketConnection';

import { Router } from 'express';
const router = Router();

router.get('/', async(req, res) => {
    const logger = new Logger("OnlinePlayers", req.body);

    try {
        const response = {
            users: UserConnection.getConnections().size
        };

        RouterUtils.success(response, logger, log);
    }
    catch(e) {
        RouterUtils.internalError(res, logger, e);
    }

});

export default router;