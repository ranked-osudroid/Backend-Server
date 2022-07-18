const { ErrorCodes } = require('@logger/codes');

exports.isValidQuery = (body, ...queryNames) => {
    for(let query of queryNames) {
        if(body[query] == undefined) {
            return false;
        }
    }
    return true;
};

exports.invalidQuery = (res, logger) => {
    res.status(422).send(`Invalid Query`);
    logger.setErrorCode(ErrorCodes.INVALID_QUERY);
    logger.error(false);
};

exports.invalidKey = (res, logger) => {
    res.status(401).send(`Invalid Key`);
    logger.setErrorCode(ErrorCodes.INVALID_KEY);
    logger.error(false);
};

exports.invalidSecure = (res, logger) => {
    res.status(401).send(`Invalid Secure`);
    logger.setErrorCode(ErrorCodes.INVALID_SECURE);
    logger.error(false);
}

exports.internalError = (res, logger, e) => {
    logger.setErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR);
    logger.setErrorStack(e);
    const log = logger.error(true);
    res.status(500).send(log);
};

exports.fail = (res, logger, code) => {
    logger.setErrorCode(code);
    const log = logger.error(false);
    res.send(log);
}

exports.success = (res, logger, data) => {
    logger.setOutput(data);
    const log = logger.success();
    res.send(log);
};

