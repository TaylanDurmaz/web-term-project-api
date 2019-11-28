const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();
    res.send({ status: 'ok', user, token });
  } catch (err) {
    res.status(400).json({ status: 'error', error: 'Invalid Credentials' });
  }
});

module.exports = router;
