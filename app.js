import * as createError from 'http-errors';
import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as mysql from 'mysql';
import * as dotenv from 'dotenv';

import ipFilter from 'express-ipfilter';

import { MySQL, MongoDB } from '#database';
import { StringUtils } from '#utils';

import mainRouter from '#routes';

// https://velog.io/@suyeonpi/Node.js-dirname-is-not-defined-ES6
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * env init
 */
dotenv.config();

/**
 * Connect to DB
 * */
MySQL.connect();
MongoDB.connect();

const app = express();
const { IpDeniedError } = ipFilter

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);
app.use('/assets', express.static('./assets'));

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

app.listen(process.env.WEB_PORT, (req, res) => {
	console.log(`Web server is now listening on port ${process.env.WEB_PORT}!`);
});