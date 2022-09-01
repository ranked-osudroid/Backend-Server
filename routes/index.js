import * as express from 'express';
import * as path from 'path';
import * as GETRouter from './GET';
import * as APIRouter from './API';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express' });
  res.send(path.join(__dirname, "../public/index.html"));
});

router.use('/', GETRouter);
router.use('/api', APIRouter);

export default router;
