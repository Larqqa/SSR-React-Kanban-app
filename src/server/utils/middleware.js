const logger = require('./logger');

// Adds request info to server log
const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

// Custom error messages
const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({
      error: 'Malformatted ID ☠️'
    });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: `${error.message}☠️`
    });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token ☠️'
    });
  }

  logger.error(error.message);

  next(error);
};

// Adds bearer token to request parameters
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