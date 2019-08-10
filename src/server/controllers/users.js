const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
  try {
    if (req.body.password.length < 3) {
      const mes = 'Password too short ☠️';
      next(new Error(mes));
      return res.status(400).send(mes).end();
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      name: req.body.name,
      passwordHash,
    });

    const newUser = await user.save();

    const userForToken = {
      username: newUser.username,
      id: newUser._id,
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

usersRouter.get('/:username', async (req, res, next) => {
  try {
    const user = await User
      .findOne({ username: req.params.username })
      .select({ id: 1 });

    if (user === null) return res.status(400).end();

    res.status(200).json(user.id);
  } catch (er) {
    next(er);
  }
});

module.exports = usersRouter;