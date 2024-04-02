const User = require('../models/Users')
const web3 = require('../configs/web3')
const asyncHandler = require('express-async-handler')
const upload = require("../middleware/upload");
const {generateAccessToken, generateRefreshToken} = require('../middleware/jwt')
const jwt = require('jsonwebtoken')
const { mongo } = require('mongoose')

require('dotenv').config({ path: '.env' })
const MONGODB_URI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const mongoClient = new MongoClient(MONGODB_URI);

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
      await upload.uploadFilesMiddleware(req, res);
      if (req.file == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }
      req.body.avatar = req.file.filename;
      
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

  uploadUserAvatar: asyncHandler(async(req, res) => {
    try {
      await upload.uploadFilesMiddleware(req, res);
      if (req.file == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }
      await User.updateOne({wallet_address: req.params.address}, {avatar: req.file.filename})
      
      return res.send({
        success: true,
        message: "File has been uploaded.",
      });
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }), 
  
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
  }),

  getUserAvatar: asyncHandler(async(req, res) => {
    try {
      await mongoClient.connect();
      var o_id = new mongo.ObjectId(req.params.id)
      const user = await User.findOne({wallet_address: req.params.address})

      const database = mongoClient.db(databaseName);
      const bucket = new GridFSBucket(database, {
        bucketName: "photos",
      });

      let downloadStream = bucket.openDownloadStreamByName(user.avatar);
  
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
  })
}

module.exports = UserController; 