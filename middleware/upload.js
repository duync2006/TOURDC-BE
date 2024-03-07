const util = require("util");
const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
// const dbConfig = require("../config/db");
const helpers = require('../helper/imageFilter')

var storage = new GridFsStorage({
  url: 'mongodb+srv://duynguyen206k20:wEfFB0PKiPJ36GKt@tourdc.qxjufkn.mongodb.net/test',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // const match = ["image/png", "image/jpeg", "image/jpg"];
    console.log("file: ", file)
    // if (match.indexOf(file.mimetype) === -1) {
    // const filename = `${Date.now()}-tourdc-${file.originalname}`;
    // return filename;
    // }

    return {
      bucketName:  "photos",
      filename: `${Date.now()}-tourdc-${file.originalname}`
    };
  }
});

var uploadFiles = multer({ storage: storage, fileFilter: helpers.imageFilter }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);

var uploadMultipleFiles = multer({ storage: storage, fileFilter: helpers.imageFilter }).array("file", 2)
var uploadMultipleFilesMiddleware = util.promisify(uploadMultipleFiles)

module.exports = {uploadFilesMiddleware, uploadMultipleFilesMiddleware};