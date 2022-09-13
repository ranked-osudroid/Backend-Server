import { ErrorCodes } from '#codes';

/**
 * Request 요청이 알맞은 쿼리 목록과 함께 요청되었는지 검사하는 함수 입니다.
 * @param {Object} body 검사할 대상의 Object를 입력 받습니다.
 * @param  {...String} queryNames 검사할 쿼리의 이름 목록을 입력 받습니다. 
 * @returns queryNames에 있는 모든 이름이 body에 있을 경우 true, 하나라도 없을 경우 false를 반환합니다.
 */
export const isValidQuery = (body, ...queryNames) => {
    for(let query of queryNames) {
        if(body[query] == undefined) {
            return false;
        }
    }
    return true;
}

/**
 * Request 요청이 알맞은 쿼리가 아닐 경우, 요청을 거부하는 함수 입니다.
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 */
export const invalidQuery = (res, logger) => {
    res.status(422).send(`Invalid Query`);
    logger.setErrorCode(ErrorCodes.INVALID_QUERY);
    logger.error(false);
}

/**
 * Request 요청에 있는 API Key가 알맞지 않을 경우, 요청을 거부하는 함수 입니다.
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 */
export const invalidKey = (res, logger) => {
    res.status(401).send(`Invalid Key`);
    logger.setErrorCode(ErrorCodes.INVALID_KEY);
    logger.error(false);
}

/**
 * Request 요청에 있는 암호 검사 문자열이 올바르지 않은 경우, 요청을 거부하는 함수 입니다.
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 */
export const invalidSecure = (res, logger) => {
    res.status(401).send(`Invalid Secure`);
    logger.setErrorCode(ErrorCodes.INVALID_SECURE);
    logger.error(false);
}

/**
 * 요청을 처리 하는중, 예외 처리가 되지 않은 예외가 발생한 경우, 요청을 거부하고
 * 로그를 데이터베이스에 저장하는 함수 입니다.
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 * @param {Object} e catch(e)에 담긴 Object를 입력 받습니다. 
 */
export const internalError = async (res, logger, e) => {
    logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
    logger.setErrorStack(e);
    const log = await logger.error(true);
    res.status(500).send(log);
}

/**
 * 요청 처리중 예외 상황이 발생한 경우, 에러코드와 함께 요청을 거부 합니다.
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 * @param {ErrorCodes} code 해당 예외에 해당하는 에러 코드를 입력 받습니다. 
 */
export const fail = async (res, logger, code) => {
    logger.setErrorCode(code);
    const log = await logger.error(false);
    res.send(log);
}

/**
 * 요청이 성공적으로 처리된 경우, Res
 * @param {Object} res Express Router의 res Object를 입력 받습니다.
 * @param {Logger} logger Logger의 인스턴스를 입력 받습니다.
 * @param {Object} data 최종적으로 Response를 보낼 Object를 입력 받습니다. 
 */
export const success = (res, logger, data) => {
    logger.setOutput(data);
    const log = logger.success();
    res.send(log);
}

