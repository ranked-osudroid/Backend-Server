import * as createError from 'http-errors';
import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import ipFilter from 'express-ipfilter';

import { MySQL, MongoDB } from '#database';
import { Utils } from '#utils';
import { NotFoundLogs } from '#schemas';
import SocketHandler from '#socket';

import mainRouter from '#routes';

// https://velog.io/@suyeonpi/Node.js-dirname-is-not-defined-ES6
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * env init
 */
dotenv.config();

/*
 * Connect to DB
 */
MySQL.connect();
MongoDB.connect();

const app = express();
const httpServer = createServer(app);
const socketServer = new Server(httpServer);
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
		NotFoundLogs.create({
			ip: req.headers['x-forwarded-for'].split(",")[0],
			method: req.method,
			url: req.url,
			body: req.body,
			time: Utils.getUnixTime()
		});
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

httpServer.listen(process.env.WEB_PORT, async (req, res) => {
	console.log(`Web server is now listening on port ${process.env.WEB_PORT}!`);
	SocketHandler();
});

export { socketServer, httpServer }