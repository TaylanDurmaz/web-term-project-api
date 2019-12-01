const express = require('express');
const multer = require('multer');
const uploadImage = require('../service/s3');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const Event = require('../models/event');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ time: { $gt: new Date().toISOString() } }).populate('owner');
    res.status(200).json({
      status: 'ok',
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', ...err });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ time: { $gt: new Date().toISOString() } }).sort('time').limit(3).populate('owner');
    res.status(200).json({
      status: 'ok',
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const cpUpload = upload.fields([{ name: 'image' }]);
router.post('/', cpUpload, async (req, res) => {
  try {
    const image = req.files.image[0];
    const imageLink = await uploadImage(image);

    const eventInfo = JSON.parse(req.body.event);

    const event = new Event({
      name: eventInfo.name,
      desc: eventInfo.desc,
      place: eventInfo.place,
      time: eventInfo.time,
      owner: req.user.ownerOf,
      imageUrl: imageLink,
    });
    const createdEvent = await event.save();

    const populatedEvent = await Event.findById(createdEvent.id).populate('owner');
    res.status(201).json({ status: 'ok', data: populatedEvent });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.delete('/:eventId', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete({ _id: req.params.eventId });
    if (deletedEvent)res.status(200).json({ status: 'ok', message: 'deleted' });
    else res.status(404).json({ status: 'error', error: 'Event not found' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
