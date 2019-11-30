const express = require('express');

const router = express.Router();
const Topic = require('../models/topic');
const Comment = require('../models/comment');

router.get('/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const comments = await Comment.find({ topic: topicId }).populate('owner').select('-owner.role');
    res.status(200).json({
      status: 'ok',
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const topic = await Topic.findById(req.body.topicId);
    if (!topic) { throw new Error('Topic not found'); }

    const comment = new Comment({
      message: req.body.message,
      topic: req.body.topicId,
      owner: req.user.id,
    });
    await comment.save();
    await Topic.updateOne({ _id: topic.id }, { commentCount: topic.commentCount + 1 });

    res.status(201).json({ status: 'ok', data: comment });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});


module.exports = router;
