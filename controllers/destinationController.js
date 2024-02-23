const { mongo } = require('mongoose')
const Destination = require('../models/Destination')
var appRoot = require('app-root-path')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

const upload = require("../middleware/upload");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const mongoClient = new MongoClient(MONGODB_URI);
const baseUrl = "http://localhost:5500/api/destination/getDestinationThumbnail/";
const DestinationController = {
  
  getAllDestinations: async(req, res) => {
    try {
      const destinations = await Destination.find()
      res.status(200).send(destinations)
    } catch (error) {
      console.log(error)
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
    // try {
    //   var o_id = new mongo.ObjectId(req.params.destinationId)
    //   const destination = await Destination.findOne({_id: o_id})
    //   console.log('file: ', req.file)
    //   await Destination.updateOne({_id: o_id}, {thumbnail: req.file.filename})
    //   res.status(200).send(`Update Success: ${req.file.filename}`)
    // } catch (err) {
    //   console.log(err)
    //   res.status(500).send(err)
    // }
    try {
      await upload(req, res);
      const filename = `${Date.now()}-tourdc-${req.file.originalname}`
      console.log(filename)
      if (req.file == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }
      var o_id = new mongo.ObjectId(req.params.destinationId)
      const destination = await Destination.findOne({_id: o_id})
      await Destination.updateOne({_id: o_id}, {thumbnail: req.file.filename})
      
      return res.send({
        message: "File has been uploaded.",
      });
    } catch (error) {
      console.log(error);
  
      return res.send({
        message: "Error when trying upload image: ${error}",
      });
    }
  },
  getDestinationThumbnail: async(req, res) => {
    try {
      console.log("hello")
      await mongoClient.connect();
  
      const database = mongoClient.db(databaseName);
      const bucket = new GridFSBucket(database, {
        bucketName: "photos",
      });
  
      let downloadStream = bucket.openDownloadStreamByName(req.params.name);
  
      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });
  
      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });
  
      downloadStream.on("end", () => {
        return res.end();
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  getDestinationThumbnailById: async(req, res) => {
    try {
      await mongoClient.connect();
      var o_id = new mongo.ObjectId(req.params.id)
      const destination = await Destination.findOne({_id: o_id})

      const database = mongoClient.db(databaseName);
      const bucket = new GridFSBucket(database, {
        bucketName: "photos",
      });

      let downloadStream = bucket.openDownloadStreamByName(destination.thumbnail);
  
      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });
  
      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });
  
      downloadStream.on("end", () => {
        return res.end();
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  getListFiles: async (req, res) => {
    try {
      await mongoClient.connect();
  
      const database = mongoClient.db('test');
      const images = database.collection('photos' + ".files");
  
      const cursor = images.find({});
  
      if ((await cursor.count()) === 0) {
        return res.status(500).send({
          message: "No files found!",
        });
      }
  
      let fileInfos = [];
      await cursor.forEach((doc) => {
        fileInfos.push({
          name: doc.filename,
          url: baseUrl + doc.filename,
        });
      });
  
      return res.status(200).send(fileInfos);
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  },
}

module.exports = DestinationController