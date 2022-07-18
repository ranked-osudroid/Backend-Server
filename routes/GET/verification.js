const fs = require('fs');
const mime = require('mime');

import { Logger } from '@logger';
import { ErrorCodes } from '@logger/codes';

import * as express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const file = `./verify_beatmap/Various Artist - Ranked Osu!droid Bind Verification (Last wish(feat. Ny-Aru)).osz`;
        const filename = `Various Artist - Ranked Osu!droid Bind Verification (Last wish(feat. Ny-Aru)).osz`;
        const mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        let filestream = fs.createReadStream(file);
        filestream.pipe(res);
        return;
    }
    catch (e) {
        const logger = new Logger("Verification", "Verification GET");
        logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
        logger.setErrorStack(e);
        logger.error(true);
        res.send(`Failed to download verification beatmap!\nContact to fixca about this error!`);
        return;
    }
});

module.exports = router;