const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://duynguyen206k20:wEfFB0PKiPJ36GKt@tourdc.qxjufkn.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db