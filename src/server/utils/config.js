require('dotenv').config();

let MONGODB_URI = process.env.MONGO_DB;

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGO_DEV_DB;
}

module.exports = {
  MONGODB_URI,
};