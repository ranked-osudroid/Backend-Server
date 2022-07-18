const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('https://discord.gg/fgGxc49eyE');
    return;
});

module.exports = router;