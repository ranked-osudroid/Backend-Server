const express = require('express');
const router = express.Router();
const { Logger } = require('../Utils');
const { tokens } = require('../database/mongodb').schemas;

router.get('/', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            res.send(`Invalid Query.`);
            return;
        }

        const log = await tokens.find({
            id: id
        });

        if(log.length == 0) {
            res.send(`This id of tokenList does not exist or is expired.`);
            return;
        }

        res.send(JSON.stringify({
            id: log[0]["id"],
            tokens: log[0]["tokens"]
        }, null, "\t"));
    }
    catch (e) {
        Logger.printStackTrace(e);
        res.send(`An error has occurred.`);
    }
});

module.exports = router;