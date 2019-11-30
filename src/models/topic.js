const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const TopicSchema = mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  message: { type: String, required: true, maxlength: 300 },
  owner: { type: types.ObjectId, ref: 'User' },
  commentCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Topic', TopicSchema);
