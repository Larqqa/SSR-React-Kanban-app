const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = mongoose.Schema({
  title: String,
  description: String,
  progress: {
    todo: [],
    inProg: [],
    done: [],
  },
  read: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  } ],
  readAndWrite: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  } ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

// Format id to be more usable & remove useless & sensitive info from response objects
projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

projectSchema.plugin(uniqueValidator);

const Project = mongoose.model('Project', projectSchema);

module.exports =  Project;