const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

const Transaction = require('../models/TransactionHistory')

const web3 = require('../configs/web3')
const toObject = require('../helper/toObject')

const asyncHandler = require('express-async-handler')

const transactionController = {
  //0xe018f5a8d4720f39eb09145949e3541eca44d43ddd616f80e495992229007453
  addTransaction: asyncHandler(async(req, res) =>{
    try {
      const txHash = req.body.hash;
      const receipt = toObject(await web3.eth.getTransactionReceipt(txHash))
      
      const object = {
        trHash: txHash,
        postID: receipt.logs[1].topics[1],
        amount: Number(web3.utils.hexToNumber(receipt.logs[1].topics[2])),
        date: toObject((await web3.eth.getBlock(receipt.blockNumber)).timestamp),
        reason: req.body.reason,
        userAddr: receipt.from
      }
      console.log(object)
      await Transaction.create(object)
      res.status(200).send({
        success: true,
        data: object
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }),
  getTransactionHistory: asyncHandler(async(req, res) =>{
    try{
      const address = req.body.address
      const transactions = await Transaction.find({
        userAddr: address
      })
      res.status(200).send({
        success: true,
        data: transactions
      })
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

module.exports = transactionController