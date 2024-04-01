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
      console.log(destinations)
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

  addDestinationImgs: async(req, res) => {
    try {
      await upload.uploadMultipleFilesMiddleware(req, res);
      if (req.files == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }
      var listImgName = []
      for (const file of req.files) {
        listImgName.push(file.filename)
      }
      
      var o_id = new mongo.ObjectId(req.params.destinationId)
      const destination = await Destination.findOne({_id: o_id})
      await Destination.updateOne({_id: o_id}, {list_imgs: listImgName})
      
      return res.send({
        success: true,
        message: "Files has been uploaded.",
      });
    } catch (error) {
      console.log(error);
  
      return res.send({
        message: "Error when trying upload image: ${error}",
      });
    }
  },

  addThumbnail: async(req, res) => {
    try {
      await upload.uploadFilesMiddleware(req, res);
      // const filename = `${Date.now()}-tourdc-${req.file.originalname}`
      // console.log(filename)
      if (req.file == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }
      var o_id = new mongo.ObjectId(req.params.destinationId)
      const destination = await Destination.findOne({_id: o_id})
      await Destination.updateOne({_id: o_id}, {thumbnail: req.file.filename})
      // console.log(req.file)
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

  getDestinationPicture: async(req, res) => {
    try {
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
  
      const database = mongoClient.db(databaseName);
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

  checkGPS: async(req, res) => {
    try {
      const longitude = req.body.longitude
      const latitude  = req.body.latitude 
      const placeID = new mongo.ObjectId(req.body.placeID)
  
      const dest = await Destination.findById({_id: placeID}) 
      console.log(dest.latMin)
      const minLong = dest.longMin 
      const maxLong = dest.longMax
      const minLat = dest.latMin
      const maxLat = dest.latMax
      if( (minLong <= longitude && longitude <= maxLong) && (minLat <= latitude && latitude <= maxLat)) {
        res.status(200).send({
          success: true,
          message: "Valid GPS"
        })
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid GPS"
        })
      }
    } catch (error) {
      res.status(500).send({
        success: true,
        message: error.message
      })
    }
  }
}

module.exports = DestinationController