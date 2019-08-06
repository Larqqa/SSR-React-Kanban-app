const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  description: String,
  progress: {
    todo: [],
    inProg: [],
    done: [],
  },
  read: [],
  readAndWrite: [],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {

    // Format id to be more usable
    returnedObject.id = returnedObject._id.toString();

    // Delete useless info
    delete returnedObject._id;
    delete returnedObject.__v;

    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

projectSchema.plugin(uniqueValidator);

const User = mongoose.model('Project', projectSchema);

module.exports = User;