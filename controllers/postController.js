const { mongo } = require('mongoose')
const Post = require('../models/Posts')
var appRoot = require('app-root-path')
require('dotenv').config({ path: '.env' })
const web3 = require('../configs/web3')
const toObject = require('../helper/toObject')
const { json } = require('body-parser')
const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME
const asyncHandler = require('express-async-handler')

const PostController = {
  savePost: asyncHandler(async(req, res) => {
    try {
      web3.eth.transactionPollingTimeout = 5000;
      const receipt = await web3.eth.getTransactionReceipt(req.body.hash)
      console.log(toObject(receipt))
      const newPost = await Post.create({
        postID: receipt.logs[1],
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
    
  })
}

module.exports = PostController