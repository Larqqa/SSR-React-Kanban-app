const getR = require('express').Router();

getR.get('/', (req, res) => {
  res.status(200).send('moi').end();
});

module.exports = getR;