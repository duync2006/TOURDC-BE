const express = require('express');
const destinationController = require('../controllers/destinationController');
const router = express.Router();
var appRoot = require('app-root-path')
const path = require('path')


router.post('/addThumbnail/:destinationId', destinationController.addThumbnail)

router.post('/addDestinationImgs/:destinationId',destinationController.addDestinationImgs)

router.post('/addDestination', destinationController.addDestination)

router.get('/getAllDestinations', destinationController.getAllDestinations)

router.get('/getDestinationById/:destinationId', destinationController.getDestinationById)

router.get('/getDestinationPicture/:name', destinationController.getDestinationPicture)

router.get('/getDestinationThumbnailById/:id', destinationController.getDestinationThumbnailById)

// router.get('/getDestinationImgUrls/:id', destinationController.getDestinationImgsUrls)

router.get('/getListFiles', destinationController.getListFiles)

module.exports = router;
