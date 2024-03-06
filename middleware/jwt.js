const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => jwt.sign({_id: uid, role}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '30min'})
const generateRefreshToken = (uid) => jwt.sign({_id: uid}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
module.exports = {
  generateAccessToken,
  generateRefreshToken
}