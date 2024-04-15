const { mongo } = require('mongoose')
const Post = require('../models/Posts')
var appRoot = require('app-root-path')
require('dotenv').config({ path: '.env' })
const web3 = require('../configs/web3')
const toObject = require('../helper/toObject')
const { json } = require('body-parser')
const asyncHandler = require('express-async-handler')
const upload = require("../middleware/uploadPostImg");
require('dotenv').config({ path: '.env' })
const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const mongoClient = new MongoClient(MONGODB_URI);

const baseUrl = `:5500/api/post/getImg/1711987631916-tourdc-jsoncrack.com.png`
const PostController = {
  savePost: asyncHandler(async(req, res) => {
    try {
      console.log('savePost')
      web3.eth.transactionPollingTimeout = 5000;
      const receipt = await web3.eth.getTransactionReceipt(req.body.hash)
      console.log(toObject(receipt))
      const newPost = await Post.create({
        postID: receipt.logs[0].topics[1],
        trHash: req.body.hash,
        placeid: req.body.placeID,
        userAddr: receipt.from 
      })
      res.status(200).send({
        success: true,
        data: newPost
      })
    } catch (error) {
      console.log(error);
      res.status(404).send({
        success: false,
        error: error
      })
    }
  }), 
  getAllCheckInPosts: asyncHandler(async(req, res) => {
    try {
      const address = req.body.address.toLowerCase();

      const posts = await Post.find({
        userAddr: address
      })
      res.status(200).json({
        success: true,
        data: posts
      })
    } catch (error) {
      console.error(error)
      res.status(500).send({
        success: false,
        data: undefined
      })
    }
  }), 
  uploadImages: asyncHandler(async(req,res) => {
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

      await Post.updateOne({postID: req.body.postID}, {list_imgs: listImgName})
      
      return res.send({
        success: true,
        message: "File has been uploaded.",
      });
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }),
  getPostImgs: asyncHandler(async(req,res) => {
    try {
      const post = await Post.findOne({postID: req.params.postID})
      let list_imgs = post.list_imgs
      res.status(200).send({
        success: true,
        data: list_imgs
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }),

  getImg:  asyncHandler(async(req,res) => {
    try {
      await mongoClient.connect();
  
      const database = mongoClient.db(databaseName);
      const bucket = new GridFSBucket(database, {
        bucketName: "postPhotos",
      });
  
      let downloadStream = bucket.openDownloadStreamByName(req.params.picture);
  
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
      console.log(error)
      res.status(500).send(error)
    }
  }),
}

module.exports = PostController