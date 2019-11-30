const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const EventSchema = mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  place: { type: String, required: true },
  time: { type: types.Date, required: true },
  owner: { type: types.ObjectId, ref: 'Club' },
  imageUrl: { type: String },
});

module.exports = mongoose.model('Event', EventSchema);
