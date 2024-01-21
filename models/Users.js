const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {type: String, trim: true, index: true, required: true, unique: true},
  password: String,
  wallet_address: String,
  private_key: String,
  balance: {type: Number, default: 0},
  phoneNumber: String,
  rep: {type: Number, default: 15},
  name: String, 
  age: Number,
  avatar: String,
}
)

let UserModel = mongoose.model("User", user)

module.exports = UserModel