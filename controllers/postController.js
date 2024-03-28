const { mongo } = require('mongoose')
const Post = require('../models/Posts')
var appRoot = require('app-root-path')
require('dotenv').config({ path: '.env' })
const web3 = require('../config/web3')
const toObject = require('../helper/toObject')
const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

function getTransactionReceiptMined(txHash, interval) {
  const transactionReceiptAsync = function(resolve, reject) {
      web3.ethgetTransactionReceipt(txHash, (error, receipt) => {
          if (error) {
              reject(error);
          } else if (receipt == null) {
              setTimeout(
                  () => transactionReceiptAsync(resolve, reject),
                  interval ? interval : 500);
          } else {
              resolve(receipt);
          }
      });
  };
}

const PostController = {
  savePost: async(req, res) => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(req.body.hash)
      // while (receipt == undefined) {
      //   console.log('wait transaction confirmed')
      //   const intervalReceipt = setInterval(async() => {
      //     receipt = await web3.eth.getTransactionReceipt(req.body.hash)
      //   }, 5000)
      //   if(receipt) clearInterval(intervalReceipt);
      // }
      // const newPost = await Post.create({
      //   postID: receipt.logs[1],
      //   trHash: req.body.hash,
      //   placeid: req.body.placeID
      // })
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
      res.status(500).send({
        success: false,
        data: undefined
      })
    }
  }, 
  getAllCheckInPosts: async(req, res) => {
    try {
      const address = req.body.address.toLowerCase();

      const posts = await Post.find({
        userAddr: address
      })
      res.status(200).send({
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
  }
}

module.exports = PostController