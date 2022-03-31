var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  shortid = require('shortid');

var noteSchema = new Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  description: String,
  user: {
    type: String,
    ref: 'User'
  },
    provider: {
      type: String,
      ref: 'User'
    }
}, {timestamps: true});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;
