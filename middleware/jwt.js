const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => jwt.sign({_id: uid, role}, process.env.JWT_SECRET, {expiresIn: '3d'})

module.exports = {
  generateAccessToken
}