const logger = require("./loggers");

const requestLogger = (request, response, next) => {
    logger.info("Method: ", request.method);
    logger.info("Path: ", request.path);
    logger.info("Body: ", request.body);
    logger.info("---");
    next();
};

const errorHandler = (error, request, response, next) => {
    if (error.name === "ValidationError") {
        console.log(error.message);
        return response.status(400).json({ error: error.message });
    } else if (error.name === "CastError") {
        return response.status(400).json({ error: error.message });
    }
    response.status(500).end("Unexpected error");
    next(error);
};

module.exports = {
    requestLogger,
    errorHandler,
};
