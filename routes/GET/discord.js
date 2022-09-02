import * as express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('https://discord.gg/fgGxc49eyE');
    return;
});

export default router;