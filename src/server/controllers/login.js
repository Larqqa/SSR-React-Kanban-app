const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  const body = req.body;
  try {
    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null ?
      false
      :
      await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '24h' });

    res.status(200).send({
      token,
      username: user.username,
      name: user.name
    });
  } catch (er) {
    next(er);
  }
});

loginRouter.post('/auth', async (req, res, next) => {
  try {
    jwt.verify(req.body.token, process.env.SECRET);
    res.status(200).end();
  } catch (er) {
    next(er);
  }
});

module.exports = loginRouter;