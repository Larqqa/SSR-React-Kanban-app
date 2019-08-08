const jwt = require('jsonwebtoken');
const projectsRouter = require('express').Router();
const Project = require('../models/project');
const User = require('../models/user');

projectsRouter.get('/', async (req, res, next) => {
  const token = req.bearerToken;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const projects = await Project
      .find({$or:[{user: decodedToken.id}, {readAndWrite: decodedToken.id}, {read: decodedToken.id}]})
      .populate('user', { username: 1, name: 1 })
      .populate('read', { username: 1, name: 1 })
      .populate('readAndWrite', { username: 1, name: 1 });

    res.json(projects.map(project => project.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

projectsRouter.post('/', async (req, res, next) => {
  const token = req.bearerToken;

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

    const popProject = await newProject
      .populate('user', { username: 1, name: 1 })
      .execPopulate();

    user.projects = user.projects.concat(popProject._id);
    await user.save();

    res.json(popProject.toJSON());
  } catch (exception) {
    next(exception);
  }
});

projectsRouter.put('/', async (req, res, next) => {
  const token = req.bearerToken;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const id = req.body.id;
    delete req.body.id;
    delete req.body.user;

    console.log(req.body.progress.todo);

    const editedProject = await Project
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('user', { username: 1, name: 1 })
      .populate('read', { username: 1, name: 1 })
      .populate('readAndWrite', { username: 1, name: 1 })
      .exec();
    
    res.json(editedProject.toJSON());
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

projectsRouter.delete('/:id', async (req, res, next) => {
  const token = req.bearerToken;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200);
  } catch (exception) {
    next(exception);
  }
});


module.exports = projectsRouter;