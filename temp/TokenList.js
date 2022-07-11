const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Logger } = require('../Utils');

router.get('/', async (req, res) => {
  try {
    const { id } = req.query;
    if(!id) {
        res.send(`Invalid Query.`);
        return;
    } 
    const fileList = fs.readdirSync('./temp/tokenLogs');
    if(fileList.indexOf(id + ".txt") == -1) {
        res.send(`This id of tokenLog does not exist or is expired.`);
        return;
    }
    const txt = fs.readFileSync(`./temp/tokenLogs/${id}.txt`, "utf-8");
    res.send(txt);
  }
  catch(e) {
    Logger.printStackTrace(e);
    res.send(`An error has occurred.`);
  }
});

module.exports = router;