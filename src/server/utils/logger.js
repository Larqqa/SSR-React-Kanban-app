// For logging information to server log
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

// For logging errors to server log
const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error
};