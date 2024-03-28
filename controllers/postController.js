const { mongo } = require('mongoose')
const Post = require('../models/Posts')
var appRoot = require('app-root-path')
require('dotenv').config({ path: '.env' })
const web3 = require('../config/web3')
const toObject = require('../helper/toObject')
const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

const PostController = {
  savePost: async(req, res) => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(req.body.hash)
      console.log(toObject(receipt))
      const newPost = await Post.create({
        postID: receipt.logs[1],
        trHash: req.body.hash,
        placeid: req.body.placeID
      })
      res.status(200).json(toObject(receipt))
    } catch (error) {
      console.log(error);
      res.status(500).send('failed')
    }
    
  }
}

module.exports = PostController