const mongoose = require("mongoose");
// const { post } = require("../routers/userRoutes");

const post = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postID: String,
  list_imgs: {
    type: [String],
  },
  trHash: {
    type: String,
  },
  placeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  reviewtime: {
    type: Date,
    default: Date.now()
  },
})

let PostModel = mongoose.model("Post", post)

module.exports = PostModel