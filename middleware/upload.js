var appRoot = require('app-root-path')
const path = require('path')

const multer = require('multer');
const helpers = require('../helper/imageFilter')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null,appRoot + '/public/imgs/destination');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage, fileFilter: helpers.imageFilter });

module.exports = upload