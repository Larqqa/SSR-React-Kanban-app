const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({
      error: 'malformatted id'
    });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    });
  }

  logger.error(error.message);

  next(error);
};

const getBearerToken = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.bearerToken = authorization.substring(7);
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  getBearerToken,
};