const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db