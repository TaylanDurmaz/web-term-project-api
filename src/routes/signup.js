const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const user = new User({
      role: 0,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      phoneNumber: req.body.phoneNumber,
    });

    const createdUser = await user.save();
    const token = await createdUser.generateAuthToken();
    res.status(201).json({ status: 'ok', data: { createdUser, token } });
  } catch (err) {
    res.status(400).json({ status: 'error', ...err });
  }
});


module.exports = router;
