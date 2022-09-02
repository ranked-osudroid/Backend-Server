import { Utils } from '#utils';
import { StatusCodes } from '#codes';
import * as schemas from '#schemas';

export default class Logger {

    /**
     * @params type : String | API names
     * @params input : Object | request body
     */
    constructor(type, input) {
        this.type = type;
        this.input = input;
        this.output = null;
        this.time = Utils.getDate();
        this.errorCode = null;
        this.errorStack = null;
        console.log(`${this.type} is called! | Time : ${this.time}`);
    }

    success = () => {
        const log = {
            time: this.time,
            type: this.type,
            body: this.input,
            output: this.output
        };

        // MongoDB에 비동기 로그 저장
        Logs.create(log);
        schemas
    
        log["status"] = StatusCodes.SUCCESS;
        return log;
    }

    //boolean save
    /**
     * @param save : Boolean | if save is true, it will be logged to DB
     */
    error = async (save) => {
        const log = {
            time: this.time,
            type: this.type,
            code: this.errorCode,
            body: this.input
        };
        if(save) {

            // MongoDB에 동기 로그 저장
            const dbLog = await errors.create(log);
            console.log(dbLog);

            console.log(`Error! | Type : ${this.type} | LogFile : ${this.fileName}`);
            console.log(this.errorStack);
        }
        else {
            console.log(`Error! | Type : ${this.type} | Code : ${this.errorCode}`);
        }
        log["status"] = StatusCodes.FAILED;
        return log;
    }

    /**
     * @param code : Integer
     */
    setErrorCode = (code) => {
        this.errorCode = code;
    }

    //Json | String output
    setOutput = (output) => {
        this.output = output;
    }

    setErrorStack = (e) => {
        this.errorStack = e.stack;
    }

    //Object err
    static printStackTrace = (err) => {
        if (typeof err === 'object') {
            if (err.message) {
                console.log('\nMessage: ' + err.message);
            }
            if (err.stack) {
                console.log('\nStacktrace:');
                console.log('====================');
                console.log(err.stack);
            }
        }
    }
}