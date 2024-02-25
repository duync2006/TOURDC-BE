const User = require('../models/Users')
const web3 = require('../config/web3')
const asyncHandler = require('express-async-handler')
const { uploadToCloudDinary, resizeUrlCloundinary } = require('../service/cloudinary')
const generateAccessToken = require('../middleware/jwt').generateAccessToken

const UserController =  {
  login: asyncHandler(async(req, res) => {
    if (req.body.username == "" || req.body.password == "") {
      return res.status(400).json({
        success: false, 
        message: "Missing Input"
      })
    }
    const user = await User.findOne({username: req.body.username})
    // console.log("Is correct Password", await user.isCorrectPassword(req.body.password))
    if (user && await user.isCorrectPassword(req.body.password)) {
      const accessToken = generateAccessToken(user._id, user.role)
      res.status(200).json({
        success: true,
        accessToken,
        userData: user
      })
    } else {
      throw new Error('Invalid credentials')
    }
  }),

  createUser: asyncHandler(async(req, res) => {
      if (req.body.username == "" || req.body.password == "") {
        return res.status(400).json({
          success: false, 
          message: "Missing Input"
        })
      }
      const user = await User.findOne({username: req.body.username})
      if (user) throw new Error('User Has Existed')
      if (req.body.waller_address == "" || req.body.waller_address == null) {
        let newWallet = web3.eth.accounts.create()
        console.log(newWallet.address)
        req.body.wallet_address = newWallet.address
        req.body.private_key = newWallet.privateKey
      }
      const newUser = await User.create(req.body);
      return res.status(200).json(newUser);
  }),

  uploadUserAvatar: async(req, res) => {
    try {
      // console.log(req.file)
      const data = await uploadToCloudDinary(req.file.path, 'avatar');
      console.log(data)
      const savingImg = await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            avatar: data.url
          }
        }
      )
      res.status(200).send('Upload Success')
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}

module.exports = UserController;