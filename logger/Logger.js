import { Utils } from '#utils';
import { StatusCodes } from '#codes';
import { Errors, Logs } from '#schemas';

export default class Logger {

    /**
     * Logger 인스턴스를 생성합니다.
     * @param {String} type API 의 타입을 입력 받습니다.
     * @param {Object} input Request의 body 를 입력 받습니다.
     */
    constructor(type, input) {
        this.type = type;
        this.input = input;
        if(typeof type !== 'string') {
            throw new Error("IllegalTypeError : The type of 'type' should be string!");
        }
        if(typeof input !== 'object') {
            throw new Error("IllegalTypeError : The type of 'input' should be object!");
        }
        this.output = null;
        this.time = Utils.getDate();
        this.errorCode = null;
        this.errorStack = null;
    }

    /**
     * 요청을 오류 없이 성공적으로 실행했을때 데이터베이스에 요청 로그를 저장하는 함수입니다.
     * @returns {Object} 요청 시간, request 종류, request body, response body, 요청 결과 코드를 저장한 Object를 반환합니다.
     */
    success = () => {
        const log = {
            status: StatusCodes.SUCCESS,
            time: this.time,
            type: this.type,
            body: this.input,
            output: this.output
        };

        // MongoDB에 non-blocking 로그 저장
        Logs.create(log);

        return log;
    }

    /**
     * 요청에 오류가 발생하 경우에 디버깅 데이터 수집을 위하여
     * 로그를 저장하는 함수 입니다.
     * @param {Boolean} save DB에 로그 저장 여부를 결정합니다. true 일 경우 DB에 로그를 저장하고, false 일 경우 저장하지 않습니다.
     * @returns {Object} 요청 시간, request 종류, 에러 코드, request body, 요청 결과 코드를 저장한 Object를 반환합니다.
     */
    error = (save) => {
        const log = {
            status: StatusCodes.FAILED,
            time: this.time,
            type: this.type,
            code: this.errorCode,
            body: this.input
        };
        if(save) {

            // MongoDB에 동기 로그 저장
            const dbLog = Errors.create(log);
            console.log(dbLog);

            console.log(`Error! | Type : ${this.type} | LogFile : ${this.fileName}`);
            console.log(this.errorStack);
        }
        else {
            console.log(`Error! | Type : ${this.type} | Code : ${this.errorCode}`);
        }
        
        return log;
    }

    /**
     * 요청에 문제가 있을 경우, error() 함수 호출 전 에러 코드를 저장합니다.
     * @param {ErrorCodes} code 해당하는 에러의 에러 코드를 입력 받습니다.
     */
    setErrorCode = (code) => {
        this.errorCode = code;
    }

    /**
     * 요청이 성공적으로 실행된 경우, Response를 보낼 Body를 저장합니다.
     * @param {Object} output Response의 Body를 입력 받습니다.
     */
    setOutput = (output) => {
        this.output = output;
    }

    /**
     * 예외 처리에서 발생한 Error의 Object를 저장합니다
     * @param {Object} e Error의 Object 형을 입력 받습니다.
     */
    setErrorStack = (e) => {
        this.errorStack = e.stack;
    }

    /**
     * 예외 처리에서 발생한 Error의 Object를 콘솔에 출력합니다.
     * @param {Object} e Error의 Object 형을 입력 받습니다.
     */
    static printStackTrace = (e) => {
        if (e instanceof Object) {
            if (e.message) {
                console.log('\nMessage: ' + e.message);
            }
            if (e.stack) {
                console.log("\nStacktrace:");
                console.log("====================");
                console.log(e.stack);
            }
        }
    }
}