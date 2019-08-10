const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const passwordCorrect = user === null ?
      false
      :
      await bcrypt.compare(req.body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'Invalid username or password ☠️'
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
      name: user.name,
      id: user.id
    });
  } catch (er) {
    next(er);
  }
});

loginRouter.get('/auth', async (req, res, next) => {
  try {
    jwt.verify(req.bearerToken, process.env.SECRET);
    res.status(200).end();
  } catch (er) {
    res.status(401).json({ error: 'Token missing or invalid ☠️' });
    next(er);
  }
});

module.exports = loginRouter;