const express = require('express');
const destinationController = require('../controllers/destinationController');
const router = express.Router();
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
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    // console.log("uniqueSuffix: ", uniqueSuffix)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage, fileFilter: helpers.imageFilter });

router.post('/addThumbnail/:destinationId', destinationController.addThumbnail)

router.post('/addDestination', destinationController.addDestination)

router.get('/getAllDestinations', destinationController.getAllDestinations)

router.get('/getDestinationById/:destinationId', destinationController.getDestinationById)

router.get('/getDestinationThumbnail/:destinationId', destinationController.getDestinationThumbnail)

router.get('/getListFiles', destinationController.getListFiles)

router.get('/files/:name', destinationController.download)

module.exports = router;
