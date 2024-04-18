const mongoose = require("mongoose");
// const { post } = require("../routers/userRoutes");

const post = new mongoose.Schema({
  userAddr: String,
  postID: String,
  list_imgs: {
    type: [String],
  },
  trHash: {
    type: String, index: { unique: true }
  },
  placeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  checkInTime: {
    type: Date,
    default: Date.now()
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
})

let PostModel = mongoose.model("Post", post)

module.exports = PostModel