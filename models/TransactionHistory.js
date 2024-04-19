const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  trHash: {
    type: String,
    index: { unique: true }
  },
  postID: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  reason: {
    type: String
  },
  amount: {
    type: Number
  },
  userAddr: {
    type: String
  }
})

let Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction