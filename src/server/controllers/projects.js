const jwt = require('jsonwebtoken');
const projectsRouter = require('express').Router();
const Project = require('../models/project');
const User = require('../models/user');

const getToken = req => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

projectsRouter.get('/', async (req, res, next) => {
  const token = getToken(req);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const projects = await Project
      .find({user: decodedToken.id})
      .populate('user', { username: 1, name: 1 });

    res.json(projects.map(project => project.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

projectsRouter.post('/', async (req, res, next) => {
  const token = getToken(req);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      user: user._id
    });

    const newProject = await project.save();

    user.projects = user.projects.concat(newProject._id);
    await user.save();

    res.json(newProject.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = projectsRouter;