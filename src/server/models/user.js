const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: String,
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
});

userSchema.set('toJSON', {
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

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;