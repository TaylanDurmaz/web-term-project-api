const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const UserSchema = mongoose.Schema({
  role: { type: Number, required: true },

  email: {
    type: String, required: true, unique: true,
  },
  password: { type: String, required: true, select: false },

  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String },

  ownerOf: { type: types.ObjectId, ref: 'Club' },
});

module.exports = mongoose.model('User', UserSchema);
