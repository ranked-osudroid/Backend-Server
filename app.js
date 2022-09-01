import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as mysql from 'mysql';
import * as dotenv from 'dotenv';

import { IpDeniedError } from 'express-ipfilter';

import { MySQL, MongoDB } from '#database';
import { StringUtils } from '#utils';

/**
 * env init
 */
dotenv.config();

/**
 * Connect to DB
 * */
MySQL.connect();
MongoDB.connect();

import * as indexRouter from '#routes';
import * as APIRouter from '#routes';
import * as TokenRouter from '#temp';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/assets', express.static('./assets'));
app.use('/api', APIRouter);
app.use('/tokenList', TokenRouter);

app.disable('x-powered-by');

// catch 404 and forward to error handler
app.use((req, res, next) => {
	console.log(`404 detected. IP : ${req.headers['x-forwarded-for']}`);
	try {
		MySQL.query(`INSERT INTO \`404Handle\`(\`id\`, \`method\`, \`ip\`, \`url\`, \`time\`) VALUES("${StringUtils.getAlphaNumericString(7)}", "${req.method}", "${req.headers['x-forwarded-for'].split(",")[0]}", "${mysql.escape(req.url)}", UNIX_TIMESTAMP());`);
	}
	catch(e) {

	}
	// console.log(req.url);
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	if (err instanceof IpDeniedError) {
		res.send('Access Denied');
		res.status(401).end();
	}
	else {
		// render the error page
		res.status(err.status || 500);
		res.render('error');
	}
});

module.exports = app;
