const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async(req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) return res.status(401).json({
        success: false,
        message: "Invalid access token"
      }) 
      else {
        console.log(decode)
        req.user = decode
        next()
      }
    })
  } else {
    return res.status(401).json({
      success: false,
      message: "Require authentication!"
    })
  }
})

module.exports = {verifyAccessToken}