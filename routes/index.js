let express = require('express');
let router = express.Router();
const path = require('path');
const GETRouter = require('../GET');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(path.join(__dirname, "../public/index.html"));
});

router.use('/', GETRouter);

module.exports = router;
