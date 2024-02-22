const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  referPlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  thumbnail: {
    type: String,
  },
  intro: {
    type: String,
  },
  address: {
    type: String,
  },
  list_imgs: {
    type: [String]
  },
  trips: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Trip'
  },
  rate: {
    type: Number
  }
})

let Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination