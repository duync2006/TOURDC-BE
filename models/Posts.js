// const mongoose = require("mongoose");
// // const { post } = require("../routers/userRoutes");

// const post = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   list_imgs: {
//     type: [String],
//   },
//   trHash: {
//     type: String,
//   },
//   placeid: {
//     type: String,
//   },
//   like: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: 'User',
//     default: []
//   },
//   dislike: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: 'User',
//     default: []
//   },
//   tripid: {
//     type: String, // txHash
//   },
//   reviewtime: {
//     type: Date,
//     default: Date.now()
//   },
//   title: {
//     type: String,
//   },
//   description: {
//     type: String,
//   },
//   rate: {
//     type: Number,
//   }
// })

// let PostModel = mongoose.model("Post", post)

// module.exports = PostModel