const express = require('express');

const router = express.Router();

const User = require('../models/user');
const Club = require('../models/club');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'ok',
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User({
      role: 2,
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

router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      if (user.ownerOf) {
        await Club.updateOne({ _id: user.ownerOf }, { owner: null });
      }

      await User.deleteOne({ _id: user.id });
      res.status(200).json({ status: 'ok', message: 'deleted' });
    } else { res.status(404).json({ status: 'error', error: 'User not found' }); }
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});


module.exports = router;
