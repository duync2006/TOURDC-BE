const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: String,
  password: String,
  wallet_address: String,
  private_key: String,
  balance: Int32Array,
}
)

let UserModel = mongoose.model("User", user)

module.exports = UserModel