const express = require('express');

const router = express.Router();
const Club = require('../models/club');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User({
      role: 1,
      email: req.body.owner.email,
      password: req.body.owner.password,
      name: req.body.owner.name,
      surname: req.body.owner.surname,
      phoneNumber: req.body.owner.phoneNumber,
    });

    const createdUser = await user.save();

    const club = new Club({
      name: req.body.name,
      desc: req.body.desc,
      owner: createdUser.id,
    });

    const savedClub = await club.save();
    res.status(200).json(savedClub);
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
