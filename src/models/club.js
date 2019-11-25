const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const ClubSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  owner: { type: types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Club', ClubSchema);
