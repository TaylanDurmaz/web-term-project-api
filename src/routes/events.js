const express = require('express');

const router = express.Router();
const Club = require('../models/club');
const Event = require('../models/event');

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate("owner");
        res.status(200).json({
            status: "ok",
            count: events.length,
            data: events
        });
    } catch (err) {
        res.status(500).json({ status: "error", ...err });
    }
});

router.post('/', async (req, res) => {
    try {
        const event = new Event({
            name: req.body.name,
            desc: req.body.desc,
            time: req.body.time,
            owner: req.body.owner
        });
        const createdEvent = await event.save();
        const populatedEvent = await Event.findById(createdEvent.id).populate("owner");

        res.status(201).json({ status: "ok", data: populatedEvent });
    } catch (err) {
        res.status(500).json({ status: "error", ...err });
    }
});

router.delete("/:eventId", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete({ _id: req.params.eventId });
        if (deletedEvent)
            res.status(200).json({ status: "ok", message: "deleted" })
        else
            res.status(404).json({ status: "error", errors: ["event not found"] })
    }
    catch (err) {
        res.status(400).json({ status: "error", ...err })
    }
})

module.exports = router;
