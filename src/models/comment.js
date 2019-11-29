const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const CommentSchema = mongoose.Schema({
  message: { type: String, required: true, maxlength: 300 },
  topic: { type: types.ObjectId, ref: 'Topic' },
  owner: { type: types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Comment', CommentSchema);
