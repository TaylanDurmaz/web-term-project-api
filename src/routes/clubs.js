const express = require('express');
const multer = require('multer');
const uploadImage = require('../service/s3');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const Club = require('../models/club');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().populate('owner');
    res.status(200).json({
      status: 'ok',
      count: clubs.length,
      data: clubs,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', ...err });
  }
});


const cpUpload = upload.fields([{ name: 'logo' }]);
router.post('/', cpUpload, async (req, res) => {
  try {
    const logo = req.files.logo[0];
    const imageLink = await uploadImage(logo);

    const ownerInfo = JSON.parse(req.body.owner);
    const clubInfo = JSON.parse(req.body.club);

    const user = new User({
      role: 1,
      email: ownerInfo.ownerEmail,
      password: ownerInfo.ownerPassword,
      name: ownerInfo.ownerName,
      surname: ownerInfo.ownerSurname,
      phoneNumber: ownerInfo.ownerPhoneNumber,
    });
    const createdUser = await user.save();

    const club = new Club({
      name: clubInfo.name,
      desc: clubInfo.desc,
      owner: createdUser.id,
      logoUrl: imageLink,
    });
    const createdClub = await club.save();

    await User.updateOne({ _id: createdUser.id }, { ownerOf: createdClub.id });
    const populatedClub = await Club.findById(createdClub.id).populate('owner');
    res.status(201).json({ status: 'ok', data: populatedClub });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});

router.delete('/:clubId', async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (club) {
      if (club.owner) {
        const owner = await User.findById(club.owner);
        await User.deleteOne({ _id: owner.id });
      }

      await Club.deleteOne({ _id: req.params.clubId });

      res.status(200).json({ status: 'ok', message: 'deleted' });
    } else { res.status(404).json({ status: 'error', error: 'Club not found' }); }
  } catch (err) {
    res.status(400).json({ status: 'error', ...err });
  }
});

module.exports = router;
