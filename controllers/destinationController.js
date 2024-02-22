const { mongo } = require('mongoose')
const Destination = require('../models/Destination')

const DestinationController = {
  
  getAllDestinations: async(req, res) => {
    try {
      const destination = await Destination.find()
      res.status(200).send(destination)
    } catch (error) {
      res.status(500).send(error)
    }
  },

  getDestinationById: async(req, res) => {
    try {
      var o_id = new mongo.ObjectId(req.params.destinationId)
      const destination = await Destination.findOne({_id: o_id})
      res.status(200).send(destination)
    } catch (error) {

    }
  },

  addDestination: async(req, res) => {
    try {
      const newDestination = await Destination.create(req.body)
      res.json(newDestination)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  addThumbnail: async(req, res) => {
    try {
      var o_id = new mongo.ObjectId(req.params.destinationId)
      const destination = await Destination.findOne({_id: o_id})
      console.log('file: ', req.file)
      await Destination.updateOne({_id: o_id}, {thumbnail: req.file.filename})
      res.status(200).send(`Update Success: ${req.file.filename}`)
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  }

}

module.exports = DestinationController