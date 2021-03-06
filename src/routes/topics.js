const express = require('express');

const router = express.Router();
const User = require('../models/user');
const Topic = require('../models/topic');
const Comment = require('../models/comment');

router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().populate('owner');
    res.status(200).json({
      status: 'ok',
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.get('/hot', async (req, res) => {
  try {
    const topics = await Topic.find().sort('-commentCount').limit(3).populate('owner');
    res.status(200).json({
      status: 'ok',
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const topic = new Topic({
      title: req.body.title,
      message: req.body.message,
      owner: req.user.id,
    });
    await topic.save();

    const populatedTopic = await Topic.findById(topic.id).populate('owner');
    res.status(201).json({ status: 'ok', data: populatedTopic });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});


router.delete('/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId);
    if (topic) {
      const owner = await Comment.deleteMany({ topic: topicId });
      await Topic.deleteOne({ _id: topicId });
      res.status(200).json({ status: 'ok', message: 'deleted' });
    } else { res.status(404).json({ status: 'error', error: 'Topic not found' }); }
  } catch (err) {
    res.status(400).json({ status: 'error', ...err });
  }
});


module.exports = router;
