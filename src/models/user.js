const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const types = mongoose.SchemaTypes;

const UserSchema = mongoose.Schema({
  role: { type: Number, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' });
      }
    },
  },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String },
  ownerOf: { type: types.ObjectId, ref: 'Club' },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  if (user.password !== password) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
