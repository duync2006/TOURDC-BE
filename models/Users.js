const mongoose = require("mongoose");
const { post } = require("../routers/userRoutes");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const user = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    index: true,
    required: true,
    unique: true,
  },
  password: String,
  wallet_address: String,
  private_key: String,
  balance: { type: Number, default: 0 },
  phoneNumber: String,
  rep: { type: Number, default: 15 },
  name: String,
  age: Number,
  avatar: String,
  role: { type: String, default: 'user' },
  post: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
  },
});

user.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  // console.log(this.password)
});

user.methods = {
  isCorrectPassword: async function(password) {
    console.log("password:", password)
    return await bcrypt.compare(password, this.password);
  }
}
let UserModel = mongoose.model("User", user);

module.exports = UserModel;

