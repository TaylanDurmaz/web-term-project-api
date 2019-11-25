const express = require('express');

const router = express.Router();
const Club = require('../models/club');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().populate("owner");
    res.status(200).json({
      status: "ok",
      count: clubs.length,
      data: clubs
    });
  } catch (err) {
    res.status(500).json({ status: "error", ...err });
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
    const createdClub = await club.save();

    await User.updateOne({ _id: createdUser.id }, { ownerOf: createdClub.id })
    const populatedClub = await Club.findById(createdClub.id).populate("owner");
    res.status(201).json({ status: "ok", data: populatedClub });
  } catch (err) {
    res.status(500).json({ status: "error", ...err });
  }
});

router.delete("/:clubId", async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (club) {
      if (club.owner) {
        const owner = await User.findById(club.owner);
        await User.deleteOne({ _id: owner.id });
      }

      await Club.deleteOne({ _id: req.params.clubId });

      res.status(200).json({ status: "ok", message: "deleted" })
    }
    else
      res.status(404).json({ status: "error", errors: ["club not found"] })
  }
  catch (err) {
    res.status(400).json({ status: "error", ...err })
  }
})

module.exports = router;
