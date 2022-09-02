import { ErrorCodes } from '#codes';

export const isValidQuery = (body, ...queryNames) => {
    for(let query of queryNames) {
        if(body[query] == undefined) {
            return false;
        }
    }
    return true;
};

export const invalidQuery = (res, logger) => {
    res.status(422).send(`Invalid Query`);
    logger.setErrorCode(ErrorCodes.INVALID_QUERY);
    logger.error(false);
};

export const invalidKey = (res, logger) => {
    res.status(401).send(`Invalid Key`);
    logger.setErrorCode(ErrorCodes.INVALID_KEY);
    logger.error(false);
};

export const invalidSecure = (res, logger) => {
    res.status(401).send(`Invalid Secure`);
    logger.setErrorCode(ErrorCodes.INVALID_SECURE);
    logger.error(false);
}

export const internalError = (res, logger, e) => {
    logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
    logger.setErrorStack(e);
    const log = logger.error(true);
    res.status(500).send(log);
};

export const fail = (res, logger, code) => {
    logger.setErrorCode(code);
    const log = logger.error(false);
    res.send(log);
}

export const success = (res, logger, data) => {
    logger.setOutput(data);
    const log = logger.success();
    res.send(log);
};

