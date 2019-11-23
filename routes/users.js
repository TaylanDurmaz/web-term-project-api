const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/', async (req, res) => {
  const user = new User({
    role: 0,
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    phoneNumber: req.body.phoneNumber,
  });

  try {
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
