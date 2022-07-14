const express = require('express');
const subscriber = require('../models/subscriber');
const router = express.Router();
const Subscriber = require('../models/subscriber')

//configuring the routes for the get, post, update and delete

//getting all
router.get('/', async (_req, res) => {
    try {
        const subscribers = await subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//getting one subscriber with an id
router.get('/:id', getSubscriber,  (_req, res) => {
    res.send(res.subscriber.name)
})

//Creating one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//updating one using patch and not put
router.patch('/:id', getSubscriber, async  (req, res) => {
    if (req.body.name != null) {
    res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

//deleting one
router.delete('/:id', getSubscriber,  async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.messaege })
    }
})

//adding a middleware 
async function getSubscriber (req, res, next){
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
        return res.status(404).json({message:'Cannot find subscriber'})
        }
    } catch (err) {
        return res.status(500).json({ messaege: err.messaege})
    }
    res.subscriber = subscriber
    next()
}

module.exports = router