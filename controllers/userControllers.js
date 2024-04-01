const User = require('../models/Users')
const web3 = require('../config/web3')
const asyncHandler = require('express-async-handler')
const { uploadToCloudDinary, resizeUrlCloundinary } = require('../service/cloudinary')
const {generateAccessToken, generateRefreshToken} = require('../middleware/jwt')
const jwt = require('jsonwebtoken')

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
    //refreshToken --> cap moi accesstoken
    //accesstoken --> xac thuc nguoi dung, phan quyen nguoi dung

    if (user && await user.isCorrectPassword(req.body.password)) {
      const accessToken = generateAccessToken(user._id, user.role)
      const refreshToken = generateRefreshToken(user._id)
      res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 60*60*1000})
      await User.findByIdAndUpdate(user._id, {refreshToken}, {new: true})
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
        // console.log(newWallet.address)
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
      // console.log(data)
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
  }, 
  getCurrent: asyncHandler(async(req, res) => {
    const {_id} = req.user
    const user = await User.findById({_id})
    return res.status(200).json({
      success: true,
      user: user ? user : "User not found"
    })
  }),
  
  refreshAccesstoken: asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    const decode = await jwt.verify(cookie.refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    const user = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken})
    return res.status(200).json({
            success: user? true : false,
            newAccessToken: user? generateAccessToken(user._id, user.role) : 'refreshToken not match'
          })
  }), 

  logout: asyncHandler(async(req, res) => {
    const cookie = req.cookies 
    // Check for refresh token exist in cookie
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token') 
    // Delete refresh token in database
    const user = await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    // Delete refresh token in cookie ==> browser
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    return res.status(200).json({
      success: true,
      message: 'Logout is done'
    })
  }),

  checkAddressExist: asyncHandler(async(req, res) => {
    try {
      const address = req.body.address
      const user = await User.findOne({
        wallet_address: address
      })
      if(user) {
        res.status(200).send({
          success: true,
          data: user
        })
      } else {
        res.status(404).send({
          success: false,
          message: "User not found"
        })
      }
    } catch (error) {
      res.status(500).send(error)
    }
    

  })
}

module.exports = UserController; 