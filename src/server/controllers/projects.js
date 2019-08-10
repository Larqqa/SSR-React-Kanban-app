const jwt = require('jsonwebtoken');
const projectsRouter = require('express').Router();
const Project = require('../models/project');
const User = require('../models/user');

const decodeAuthToken = (req, res) => {
  const decodedToken = jwt.verify(req.bearerToken, process.env.SECRET);
  if (!req.bearerToken || !decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid ☠️' });
  }
  return decodedToken;
};

projectsRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = await decodeAuthToken(req, res);
    const user = await User.findById(decodedToken.id);

    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      user: user._id
    });

    // Create new project
    const newProject = await project.save();

    // Populate user field for new project
    const popProject = await newProject
      .populate('user', { username: 1, name: 1 })
      .execPopulate();

    // Add project id to users projects
    user.projects = user.projects.concat(popProject._id);
    await user.save();

    res.status(200).json(popProject.toJSON());
  } catch (er) {
    next(er);
  }
});

projectsRouter.get('/', async (req, res, next) => {
  try {
    const decodedToken = await decodeAuthToken(req, res);

    // Get all projects user is in
    const projects = await Project
      .find({ $or:[ { user: decodedToken.id }, { readAndWrite: decodedToken.id }, { read: decodedToken.id } ] })
      .populate('user', { username: 1, name: 1 })
      .populate('read', { username: 1, name: 1 })
      .populate('readAndWrite', { username: 1, name: 1 });

    // Respond with each project as JSON
    res.status(200).json(projects.map(
      project => project.toJSON()
    ));
  } catch (er) {
    next(er);
  }
});

projectsRouter.put('/', async (req, res, next) => {
  try {
    await decodeAuthToken(req, res);

    // Sanitize request 
    const id = req.body.id;
    delete req.body.id;
    delete req.body.user;

    const editedProject = await Project
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('user', { username: 1, name: 1 })
      .populate('read', { username: 1, name: 1 })
      .populate('readAndWrite', { username: 1, name: 1 })
      .exec();

    res.status(200).json(editedProject.toJSON());
  } catch (er) {
    next(er);
  }
});

projectsRouter.delete('/:id', async (req, res, next) => {
  try {
    await decodeAuthToken(req, res);

    await Project.findByIdAndDelete(req.params.id);

    res.status(200);
  } catch (er) {
    next(er);
  }
});


module.exports = projectsRouter;