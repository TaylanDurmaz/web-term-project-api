const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  role: { type: Number, required: true },

  email: { type: String, required: true },
  password: { type: String, required: true },

  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
